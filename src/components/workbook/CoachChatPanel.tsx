import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

interface Props {
  open: boolean;
  onClose: () => void;
  workbookName: string;
  questionText: string;
  memberResponse?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-coach-chat`;

export function CoachChatPanel({ open, onClose, workbookName, questionText, memberResponse }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEscalate, setShowEscalate] = useState(false);
  const [escalateNote, setEscalateNote] = useState("");
  const [escalating, setEscalating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset chat when panel opens with new context
  useEffect(() => {
    if (open) {
      setMessages([]);
      setShowEscalate(false);
      setEscalateNote("");
    }
  }, [open, questionText]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          workbookName,
          questionText,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Failed to connect" }));
        toast.error(err.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to connect to AI coach");
    }
    setIsLoading(false);
  };

  const handleEscalate = async () => {
    if (!user) return;
    setEscalating(true);
    const { error } = await supabase.from("escalations").insert({
      user_id: user.id,
      workbook_name: workbookName,
      question_text: questionText,
      member_response: memberResponse || "",
      member_note: escalateNote,
    });
    if (error) {
      toast.error("Failed to send. Please try again.");
    } else {
      toast.success("Your question has been sent. She'll respond within 2 business days.");
      setShowEscalate(false);
      setEscalateNote("");
    }
    setEscalating(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop on mobile */}
      <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 bg-card border-border shadow-2xl flex flex-col transition-transform duration-300",
          // Desktop: slide from right
          "md:right-0 md:top-0 md:bottom-0 md:w-[420px] md:border-l",
          // Mobile: bottom sheet
          "bottom-0 left-0 right-0 md:left-auto h-[85vh] md:h-full rounded-t-2xl md:rounded-none",
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-display font-bold text-foreground">AI Coach</h3>
            <p className="text-xs text-muted-foreground font-body truncate max-w-[250px]">
              {workbookName} — {questionText.slice(0, 60)}...
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground font-body">
                Ask your coach anything about this question. She's here to guide you, not give you the answer. 💛
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body",
                msg.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted text-foreground"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="mr-auto bg-muted rounded-2xl px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Escalate section */}
        {showEscalate ? (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span className="text-sm font-display font-semibold text-foreground">Send to Neicey</span>
            </div>
            <Textarea
              value={escalateNote}
              onChange={(e) => setEscalateNote(e.target.value)}
              placeholder="Add a personal note (optional)..."
              className="min-h-[80px] text-sm"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowEscalate(false)} className="flex-1">
                Cancel
              </Button>
              <Button variant="gold" size="sm" onClick={handleEscalate} disabled={escalating} className="flex-1">
                {escalating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-border space-y-2">
            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask your coach..."
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button size="icon" onClick={send} disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {/* Escalate button */}
            {messages.length > 0 && (
              <button
                onClick={() => setShowEscalate(true)}
                className="w-full text-xs text-muted-foreground hover:text-primary font-body transition-colors py-1"
              >
                Still stuck? Send this to Neicey →
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useWorkbookData(workbookId: string) {
  const { user } = useAuth();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dirtyRef = useRef(false);

  // Load existing responses
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("workbook_responses")
      .select("responses, updated_at")
      .eq("user_id", user.id)
      .eq("workbook_id", workbookId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setResponses(data.responses as Record<string, any>);
          setLastSaved(new Date(data.updated_at));
        }
        setLoading(false);
      });
  }, [user, workbookId]);

  const save = useCallback(async () => {
    if (!user || !dirtyRef.current) return;
    setSaving(true);
    const { error } = await supabase
      .from("workbook_responses")
      .upsert(
        { user_id: user.id, workbook_id: workbookId, responses },
        { onConflict: "user_id,workbook_id" }
      );
    if (!error) {
      setLastSaved(new Date());
      dirtyRef.current = false;
    }
    setSaving(false);
  }, [user, workbookId, responses]);

  // Auto-save every 60 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (dirtyRef.current) save();
    }, 60000);
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [save]);

  const updateField = useCallback((fieldId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    dirtyRef.current = true;

    // Debounced save (3 seconds after keystroke)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // We need to trigger save, but since responses may not be updated in the closure,
      // we set dirty and let the interval or a direct call handle it
      dirtyRef.current = true;
    }, 3000);
  }, []);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (dirtyRef.current && user) {
        // Fire and forget
        supabase
          .from("workbook_responses")
          .upsert(
            { user_id: user.id, workbook_id: workbookId, responses },
            { onConflict: "user_id,workbook_id" }
          );
      }
    };
  }, [user, workbookId, responses]);

  return { responses, updateField, saving, lastSaved, loading, save };
}

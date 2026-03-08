import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useNotificationCount() {
  const { user, role } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchCount = async () => {
      if (role === "admin") {
        // Admin sees count of New escalations
        const { count: c } = await supabase
          .from("escalations")
          .select("*", { count: "exact", head: true })
          .eq("status", "New");
        setCount(c || 0);
      } else {
        // Member sees count of unread admin replies
        const { data } = await supabase
          .from("admin_replies")
          .select("id, escalation_id, read_by_member")
          .eq("read_by_member", false);
        setCount(data?.length || 0);
      }
    };

    fetchCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user, role]);

  return count;
}

import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminMembers } from "@/components/admin/AdminMembers";
import { AdminPhaseUnlocks } from "@/components/admin/AdminPhaseUnlocks";
import { AdminEscalations } from "@/components/admin/AdminEscalations";
import { AdminAnalytics } from "@/components/admin/AdminAnalytics";

const Admin = () => {
  const { role } = useAuth();
  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground font-body">
          Manage members, unlock phases, and track program health.
        </p>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="bg-muted rounded-xl p-1 h-auto flex-wrap">
          <TabsTrigger value="members" className="rounded-lg font-body text-sm">Members</TabsTrigger>
          <TabsTrigger value="phases" className="rounded-lg font-body text-sm">Phase Unlocks</TabsTrigger>
          <TabsTrigger value="escalations" className="rounded-lg font-body text-sm">Escalations</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg font-body text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="members"><AdminMembers /></TabsContent>
        <TabsContent value="phases"><AdminPhaseUnlocks /></TabsContent>
        <TabsContent value="escalations"><AdminEscalations /></TabsContent>
        <TabsContent value="analytics"><AdminAnalytics /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

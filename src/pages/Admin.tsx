import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { role } = useAuth();

  if (role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-foreground">Admin Panel</h1>
      <div className="bg-card rounded-2xl shadow-card border border-border p-8 text-center">
        <p className="text-muted-foreground font-body">
          Manage cohort members, unlock phases, and monitor progress here. Full admin features coming soon.
        </p>
      </div>
    </div>
  );
};

export default Admin;

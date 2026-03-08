import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError("Invalid email or password. This portal is invite-only.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-navy mb-4">
            <span className="text-2xl font-display font-bold text-gold">N</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            NuWealth Academy
          </h1>
          <p className="mt-2 text-muted-foreground font-body text-sm">
            Exclusive Financial Mentorship Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-card p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-body font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl bg-background border-border font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-body font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl bg-background border-border font-body"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-body">{error}</p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground font-body">
            This portal is invite-only. Contact your coach for access.
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground/60 font-body">
          © {new Date().getFullYear()} NuWealth Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

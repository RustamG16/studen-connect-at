import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You have been logged in successfully!",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Login"
        title="Welcome back"
        lead="Enter your credentials to access your account"
      />
      <section className="shell-x pb-12 pt-8 md:pb-24 md:pt-12">
        <form onSubmit={handleSubmit} className="max-w-md space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="email" className="mb-2 block text-sm font-bold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-12"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-bold">Password</Label>
              <Link
                to="/forgot-password"
                className="inline-flex min-h-11 items-center text-sm font-medium text-primary-text underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-12"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <p className="flex flex-wrap items-center gap-x-1 text-ink-2">
            Don't have an account?{" "}
            <Link to="/signup" className="inline-flex min-h-11 items-center font-bold text-primary-text underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
};

export default Login;

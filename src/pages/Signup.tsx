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
import SignupProgress from "@/components/ledger/SignupProgress";
import { useLedger } from "@/lib/ledger";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const saved = useLedger().rows.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, name);
      toast({
        title: "Success",
        description: "Account created successfully! Welcome aboard!",
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Sign Up"
        title="Create an account"
        lead="Fill in your information to get started"
      >
        <SignupProgress
          lines={[
            name.trim() !== "",
            EMAIL.test(email),
            password.length >= 6,
            confirmPassword !== "" && confirmPassword === password,
          ]}
        />
      </PageHeader>
      <section className="shell-x pb-12 pt-8 md:pb-24 md:pt-12">
        {saved ? (
          <p className="t-meta tnum mb-5 text-ink">
            {saved} {saved === 1 ? "bonus" : "bonuses"} in your ledger
          </p>
        ) : null}
        <form onSubmit={handleSubmit} className="max-w-md space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="name" className="mb-2 block text-sm font-bold">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="h-12"
            />
          </div>
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
            <Label htmlFor="password" className="mb-2 block text-sm font-bold">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="h-12"
            />
            <p className="t-meta mt-2 text-ink-2">Must be at least 6 characters</p>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-bold">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
              className="h-12"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
          <p className="flex flex-wrap items-center gap-x-1 text-ink-2">
            Already have an account?{" "}
            <Link to="/login" className="inline-flex min-h-11 items-center font-bold text-primary-text underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </PageShell>
  );
};

export default Signup;

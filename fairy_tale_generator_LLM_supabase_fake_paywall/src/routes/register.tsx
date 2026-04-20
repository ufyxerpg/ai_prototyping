import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authContent } from "@/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — Magical Stories" },
      { name: "description", content: "Create a Magical Stories account." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const t = authContent.register;

  useEffect(() => {
    if (user && !success) navigate({ to: "/" });
  }, [user, navigate, success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError.message || t.errorGeneric);
      return;
    }
    setSuccess(true);
  };

  return (
    <AuthShell title={t.title} subtitle={t.subtitle}>
      {success ? (
        <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 text-center">
          <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
            {t.successTitle}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t.successMessage}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-border bg-surface/60 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">{t.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11 rounded-xl bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="h-11 rounded-xl bg-background/60"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
          >
            {submitting ? "…" : t.submit}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {t.switchPrompt}{" "}
            <Link to="/signin" className="font-medium text-foreground underline-offset-4 hover:underline">
              {t.switchLink}
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}

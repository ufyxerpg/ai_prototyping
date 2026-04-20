import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authContent } from "@/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — Magical Stories" },
      { name: "description", content: "Sign in to your Magical Stories account." },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const t = authContent.signIn;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_preferences")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        navigate({ to: data ? "/" : "/onboarding" });
      });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setSubmitting(false);
      setError(signInError.message || t.errorGeneric);
      return;
    }
    const userId = data.user?.id;
    if (userId) {
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      setSubmitting(false);
      navigate({ to: prefs ? "/" : "/onboarding" });
      return;
    }
    setSubmitting(false);
    navigate({ to: "/" });
  };

  return (
    <AuthShell title={t.title} subtitle={t.subtitle}>
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
            autoComplete="current-password"
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
          <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            {t.switchLink}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

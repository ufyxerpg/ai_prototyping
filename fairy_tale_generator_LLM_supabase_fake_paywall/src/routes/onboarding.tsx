import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingContent } from "@/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — Magical Stories" },
      { name: "description", content: "Tell us about your child to personalize stories." },
    ],
  }),
  component: OnboardingPage,
});

const TOTAL_STEPS = 4;

function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const t = onboardingContent;

  const [step, setStep] = useState(0);
  const [ageRange, setAgeRange] = useState("");
  const [country, setCountry] = useState("");
  const [childName, setChildName] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/signin" });
  }, [user, authLoading, navigate]);

  const canContinue = () => {
    if (step === 0) return !!ageRange;
    if (step === 1) return !!country;
    if (step === 2) return childName.trim().length > 0;
    if (step === 3) return !!gender;
    return false;
  };

  const handleNext = async () => {
    if (!canContinue()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      return;
    }
    if (!user) return;
    setError(null);
    setSubmitting(true);
    const { error: insertError } = await supabase
      .from("user_preferences")
      .insert({
        user_id: user.id,
        child_age_range: ageRange,
        country,
        child_name: childName.trim(),
        child_gender: gender,
      });
    setSubmitting(false);
    if (insertError) {
      setError(insertError.message || t.errorGeneric);
      return;
    }
    navigate({ to: "/generate" });
  };

  const handleBack = () => setStep(Math.max(0, step - 1));

  return (
    <AuthShell title={t.title} subtitle={t.subtitle}>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          {t.stepLabel} {step + 1} {t.ofLabel} {TOTAL_STEPS}
        </p>

        <div className="space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              <h2 className="font-display text-xl text-foreground">{t.steps.age.question}</h2>
              <div className="grid gap-2">
                {t.steps.age.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAgeRange(opt)}
                    className={`rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-all ${
                      ageRange === opt
                        ? "border-primary bg-primary/15 text-foreground shadow-glow"
                        : "border-border bg-surface/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <h2 className="font-display text-xl text-foreground">{t.steps.country.question}</h2>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-12 rounded-xl bg-background/60">
                  <SelectValue placeholder={t.steps.country.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {t.steps.country.options.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <Label htmlFor="childName" className="font-display text-xl text-foreground">
                {t.steps.name.question}
              </Label>
              <Input
                id="childName"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={t.steps.name.placeholder}
                maxLength={50}
                className="h-12 rounded-xl bg-background/60"
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="font-display text-xl text-foreground">{t.steps.gender.question}</h2>
              <div className="grid grid-cols-2 gap-2">
                {t.steps.gender.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGender(opt)}
                    className={`rounded-2xl border px-5 py-4 text-center text-sm font-medium transition-all ${
                      gender === opt
                        ? "border-primary bg-primary/15 text-foreground shadow-glow"
                        : "border-border bg-surface/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface/60 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              {t.back}
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue() || submitting}
            className="ml-auto inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
          >
            {submitting ? t.saving : step === TOTAL_STEPS - 1 ? t.finish : t.next}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}

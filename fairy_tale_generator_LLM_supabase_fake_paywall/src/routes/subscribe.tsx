import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribeContent } from "@/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/subscribe")({
  head: () => ({
    meta: [
      { title: "Subscribe — Magical Stories" },
      { name: "description", content: "Subscribe to unlock unlimited fairy tales." },
    ],
  }),
  component: SubscribePage,
});

async function logEvent(userId: string, eventType: string, metadata?: Record<string, unknown>) {
  await (supabase.from("payment_events" as never) as ReturnType<typeof supabase.from>).insert({
    user_id: userId,
    event_type: eventType,
    metadata: (metadata ?? null) as never,
  } as never);
}

function SubscribePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const t = subscribeContent;

  const [planId, setPlanId] = useState(t.plans[0].id);
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pageLogged, setPageLogged] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/signin" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && !pageLogged) {
      setPageLogged(true);
      logEvent(user.id, "payment_page_opened");
    }
  }, [user, pageLogged]);

  const handlePlanChange = (id: string) => {
    setPlanId(id);
    if (user) logEvent(user.id, "plan_chosen", { plan: id });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    await logEvent(user.id, "pay_clicked", { plan: planId });
    setTimeout(() => {
      setSubmitting(false);
      setShowResult(true);
    }, 600);
  };

  if (showResult) {
    return (
      <AuthShell title={t.notCompletedTitle} subtitle="">
        <div className="space-y-6">
          <p className="rounded-2xl border border-border bg-surface/40 p-5 text-sm leading-relaxed text-foreground/90">
            {t.notCompletedMessage}
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/generate" })}
            className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
          >
            {t.backButton}
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={t.title} subtitle={t.subtitle}>
      <form onSubmit={handlePay} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t.plansLabel}</Label>
          <div className="grid grid-cols-2 gap-2">
            {t.plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePlanChange(p.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  planId === p.id
                    ? "border-primary bg-primary/15 shadow-glow"
                    : "border-border bg-surface/40 hover:border-primary/50"
                }`}
              >
                <div className="font-display text-base text-foreground">{p.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">{p.price}</span>
                  {p.period}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="card">{t.cardLabel}</Label>
          <Input
            id="card"
            value={card}
            onChange={(e) => setCard(e.target.value)}
            placeholder={t.cardPlaceholder}
            inputMode="numeric"
            maxLength={19}
            required
            className="h-11 rounded-xl bg-background/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="expiry">{t.expiryLabel}</Label>
            <Input
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder={t.expiryPlaceholder}
              maxLength={5}
              required
              className="h-11 rounded-xl bg-background/60"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">{t.cvcLabel}</Label>
            <Input
              id="cvc"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              placeholder={t.cvcPlaceholder}
              inputMode="numeric"
              maxLength={4}
              required
              className="h-11 rounded-xl bg-background/60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">{t.nameLabel}</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            maxLength={100}
            required
            className="h-11 rounded-xl bg-background/60"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? t.processingButton : t.payButton}
        </button>
      </form>
    </AuthShell>
  );
}

import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { pricingContent } from "@/content";

export function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 size-[500px] -translate-x-1/2 rounded-full bg-glow-violet/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {pricingContent.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            {pricingContent.title}
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted-foreground">
            {pricingContent.description}
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {pricingContent.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-3xl border p-8 backdrop-blur-md transition-all ${
                tier.highlighted
                  ? "border-primary/50 bg-gradient-to-b from-primary/15 to-surface/40 shadow-glow"
                  : "border-border bg-surface/40 hover:border-primary/30"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {pricingContent.highlightedBadge}
                </span>
              )}
              <h3 className="font-display text-2xl font-medium tracking-tight">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {tier.description}
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-medium tracking-tight">
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              <ul className="mt-8 space-y-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all ${
                  tier.highlighted
                    ? "bg-foreground text-background hover:-translate-y-0.5 hover:shadow-glow"
                    : "border border-border bg-surface/60 text-foreground hover:bg-surface"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

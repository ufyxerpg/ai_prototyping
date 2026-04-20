import { Wand2, Sparkles, BookHeart, type LucideIcon } from "lucide-react";
import { howItWorksContent } from "@/content";

const iconMap: Record<string, LucideIcon> = {
  Wand2,
  Sparkles,
  BookHeart,
};

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-24 py-28 sm:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-border to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {howItWorksContent.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            {howItWorksContent.title}
          </h2>
          <p className="mt-5 text-pretty text-lg text-muted-foreground">
            {howItWorksContent.description}
          </p>
        </div>

        <ol className="mt-16 grid gap-6 md:grid-cols-3">
          {howItWorksContent.steps.map((step, i) => {
            const Icon = iconMap[step.icon] ?? Sparkles;
            return (
              <li
                key={step.title}
                className="group relative rounded-3xl border border-border bg-surface/40 p-8 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-surface/70"
              >
                <div className="absolute right-6 top-6 font-display text-5xl font-medium text-foreground/5">
                  0{i + 1}
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 text-primary ring-1 ring-primary/30">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

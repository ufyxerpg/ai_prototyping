import { Link } from "@tanstack/react-router";
import { ctaContent } from "@/content";

export function CTASection() {
  return (
    <section className="relative px-6 py-28 sm:py-32">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[36px] border border-border bg-gradient-to-br from-primary/20 via-surface/50 to-accent/15 p-12 text-center backdrop-blur-xl sm:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 size-[400px] -translate-x-1/2 rounded-full bg-glow-magenta/30 blur-[120px]"
        />
        <h2 className="relative font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          {ctaContent.title}
        </h2>
        <p className="relative mx-auto mt-5 max-w-lg text-pretty text-lg text-muted-foreground">
          {ctaContent.description}
        </p>
        <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-8 py-4 text-base font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow sm:w-auto"
          >
            {ctaContent.registerButton}
          </Link>
          <Link
            to="/signin"
            className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface/40 px-8 py-4 text-base font-medium text-foreground backdrop-blur-md transition-colors hover:bg-surface/70 sm:w-auto"
          >
            {ctaContent.signInButton}
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { authContent } from "@/content";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 size-[600px] rounded-full bg-glow-violet/30 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 size-[520px] rounded-full bg-glow-magenta/20 blur-[160px]"
      />

      <header className="relative px-6 py-8 lg:px-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <span className="relative flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-glow">
            <Sparkles className="size-4 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-medium tracking-tight transition-colors group-hover:text-primary">
            {authContent.brand}
          </span>
        </Link>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-border bg-surface/40 p-8 backdrop-blur-xl sm:p-10">
            <div className="text-center">
              <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

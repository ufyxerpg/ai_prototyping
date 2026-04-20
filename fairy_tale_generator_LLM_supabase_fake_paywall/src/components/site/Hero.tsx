import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import heroImage from "@/assets/hero-storybook.jpg";
import { heroContent } from "@/content";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";

export function Hero() {
  const [prompt, setPrompt] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 size-[600px] rounded-full bg-glow-violet/30 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-0 size-[520px] rounded-full bg-glow-magenta/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 size-[520px] rounded-full bg-glow-indigo/25 blur-[160px]"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {heroContent.badge}
        </div>

        <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {heroContent.titleLine1}
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary/80 bg-clip-text text-transparent">
            {heroContent.titleLine2}
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {heroContent.description}
        </p>

        {/* Prompt input */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div className="group relative rounded-3xl border border-border bg-surface/40 p-2 backdrop-blur-md transition-all focus-within:border-primary/50 focus-within:shadow-glow">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={heroContent.promptPlaceholder}
              rows={3}
              className="min-h-[88px] resize-none border-0 bg-transparent px-4 py-3 text-base shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-end px-2 pb-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
              >
                <Sparkles className="size-4" />
                {heroContent.promptButton}
              </button>
            </div>
          </div>

          {user && (
            <button
              type="button"
              onClick={() => navigate({ to: "/generate" })}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
            >
              <Wand2 className="size-4" />
              Create Your Story
            </button>
          )}

          <div>
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="mt-5 inline-block text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {heroContent.howItWorksLink}
            </a>
          </div>
        </form>
      </div>

      {/* Hero visual */}
      <div className="relative mx-auto mt-20 max-w-5xl px-6">
        <div className="relative rounded-[32px] border border-border/60 bg-surface/30 p-2 shadow-soft backdrop-blur-2xl">
          <div className="overflow-hidden rounded-[24px] border border-border/40">
            <img
              src={heroImage}
              alt={heroContent.imageAlt}
              width={1536}
              height={1024}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Floating story snippet */}
          <div className="absolute -bottom-6 left-6 hidden max-w-sm rounded-2xl border border-border bg-background/80 p-5 shadow-soft backdrop-blur-xl sm:block">
            <div className="mb-1.5 text-xs font-medium uppercase tracking-widest text-primary">
              {heroContent.chapterLabel}
            </div>
            <p className="font-display text-base leading-snug text-foreground/90">
              {heroContent.chapterText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

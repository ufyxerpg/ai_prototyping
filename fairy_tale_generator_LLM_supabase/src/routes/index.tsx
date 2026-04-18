import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Wand2, BookOpen, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarField } from "@/components/StarField";
import { streamFairyTale } from "@/lib/streamFairyTale";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Magical Stories — Conjure Fairy Tales from a Whisper" },
      {
        name: "description",
        content:
          "Enter any context and watch a one-of-a-kind fairy tale bloom. Magical Stories turns your spark of an idea into enchanting prose.",
      },
      { property: "og:title", content: "Magical Stories — Conjure Fairy Tales from a Whisper" },
      {
        property: "og:description",
        content: "Type a context, click the wand, and a fairy tale appears.",
      },
    ],
  }),
  component: MagicalStoriesPage,
});

const SAMPLE_PROMPTS = [
  "a lonely lantern that fell in love with the moon",
  "a clockmaker's daughter who could hear time singing",
  "a fox who guarded the last library of forgotten dreams",
];

function MagicalStoriesPage() {
  const [context, setContext] = useState("");
  const [story, setStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) return;
    setIsGenerating(true);
    setStory("");
    let acc = "";
    await streamFairyTale({
      context,
      onDelta: (chunk) => {
        acc += chunk;
        setStory(acc);
      },
      onDone: () => setIsGenerating(false),
      onError: (msg) => {
        toast.error(msg);
        setIsGenerating(false);
        setStory(null);
      },
    });
  };

  const [title, ...rest] = (story ?? "").split("\n\n");
  const paragraphs = rest;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <StarField />

      {/* Floating decorative orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-aurora)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col px-5 py-12 sm:py-20">
        {/* Header */}
        <header className="mb-12 text-center animate-fade-up">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[oklch(0.85_0.16_85_/_0.3)] glass px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-[var(--gold)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>A whisper of enchantment</span>
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">
            <span className="shimmer-text">Magical</span>{" "}
            <span className="text-foreground italic">Stories</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Plant a tiny seed of an idea. Watch it bloom into a one-of-a-kind fairy tale,
            spun from moonlight and whispered into being.
          </p>
        </header>

        {/* Input card */}
        <section
          className="glass shadow-soft rounded-3xl p-6 sm:p-8 animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <label
            htmlFor="story-context"
            className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground/90"
          >
            <Wand2 className="h-4 w-4 text-[var(--gold)]" />
            What shall the tale be about?
          </label>

          <Textarea
            id="story-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="A brave little teacup who longed to see the ocean…"
            rows={4}
            className="resize-none border-[oklch(0.7_0.08_290_/_0.25)] bg-[oklch(0.16_0.05_285_/_0.5)] text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-[var(--gold)]"
          />

          {/* Sample prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground/70">
              Try:
            </span>
            {SAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setContext(p)}
                className="rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-[var(--gold)]/60 hover:bg-secondary/60 hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!context.trim() || isGenerating}
            className="mt-6 h-12 w-full rounded-2xl border-0 text-base font-semibold text-[var(--primary-foreground)] shadow-glow transition-transform duration-300 hover:scale-[1.01] disabled:opacity-50"
            style={{ background: "var(--gradient-gold)" }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Weaving moonlight into words…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Conjure My Fairy Tale
              </>
            )}
          </Button>
        </section>

        {/* Story output */}
        {(isGenerating || story) && (
          <section
            className="mt-10 animate-fade-up"
            style={{ animationDelay: "200ms" }}
            aria-live="polite"
          >
            <div className="glass shadow-soft relative overflow-hidden rounded-3xl p-7 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full opacity-50 blur-3xl"
                style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }}
              />

              <div className="relative">
                <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Your Tale
                </div>

                {isGenerating ? (
                  <div className="space-y-3">
                    {[100, 92, 96, 80, 88, 70].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 animate-pulse rounded-full bg-[oklch(0.7_0.08_290_/_0.18)]"
                        style={{
                          width: `${w}%`,
                          animationDelay: `${i * 120}ms`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  story && (
                    <article>
                      <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                        <span className="text-gradient-gold italic">{title}</span>
                      </h2>
                      <div className="mt-6 space-y-5 font-display text-lg leading-relaxed text-foreground/90 sm:text-xl">
                        {paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="animate-fade-up"
                            style={{ animationDelay: `${i * 140}ms` }}
                          >
                            {i === 0 ? (
                              <>
                                <span className="float-left mr-2 mt-1 font-display text-5xl font-bold leading-none text-gradient-gold sm:text-6xl">
                                  {p.charAt(0)}
                                </span>
                                {p.slice(1)}
                              </>
                            ) : (
                              p
                            )}
                          </p>
                        ))}
                      </div>

                      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
                        <div className="flex items-center gap-2 text-xs italic text-muted-foreground">
                          <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
                          The end… or perhaps a beginning.
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleGenerate}
                          className="text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        >
                          <RefreshCw className="mr-2 h-3.5 w-3.5" />
                          Re-spin
                        </Button>
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground/60">
          Spun from imagination ✦ Powered by gpt-4o.
        </footer>
      </div>
    </main>
  );
}

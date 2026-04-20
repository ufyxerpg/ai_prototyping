import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Textarea } from "@/components/ui/textarea";
import { generateContent } from "@/content";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

const FREE_LIMIT = 3;
const EDGE_FN_URL =
  "https://ofrtkfutlghoraczeohw.supabase.co/functions/v1/openai-chat";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Create a Fairy Tale — Magical Stories" },
      { name: "description", content: "Generate a personalized AI bedtime story for your child." },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const t = generateContent;

  const [idea, setIdea] = useState("");
  const [story, setStory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyCount, setStoryCount] = useState<number | null>(null);
  const [prefs, setPrefs] = useState<{
    child_name: string;
    child_age_range: string;
    child_gender: string;
    country: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/signin" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const [{ count }, { data: p }] = await Promise.all([
        (supabase.from("stories" as never) as ReturnType<typeof supabase.from>)
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("user_preferences")
          .select("child_name,child_age_range,child_gender,country")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      setStoryCount(count ?? 0);
      setPrefs(p ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const limitReached = (storyCount ?? 0) >= FREE_LIMIT;

  const handleGenerate = async () => {
    if (!user || !idea.trim() || limitReached) return;
    setLoading(true);
    setError(null);
    setStory(null);

    const childContext = prefs
      ? `The child is named ${prefs.child_name}, is in the age range ${prefs.child_age_range}, identifies as ${prefs.child_gender}, and lives in ${prefs.country}. Tailor the story's vocabulary, length, and themes to this child.`
      : "";

    const fullPrompt = `${childContext}\n\nStory idea from the parent: ${idea.trim()}\n\nWrite a complete bedtime fairy tale for this child based on the idea above.`.trim();

    try {
      const res = await fetch(EDGE_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      const data = await res.json();
      if (!res.ok || !data?.story) {
        throw new Error(data?.error || t.errorGeneric);
      }
      setStory(data.story);

      const { error: insertErr } = await (supabase.from("stories" as never) as ReturnType<typeof supabase.from>).insert({
        user_id: user.id,
        context: idea.trim(),
        result: data.story,
      } as never);
      if (!insertErr) setStoryCount((c) => (c ?? 0) + 1);
    } catch (e) {
      setError((e as Error).message || t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setStory(null);
    setIdea("");
    setError(null);
  };

  return (
    <AuthShell title={t.title} subtitle={t.subtitle}>
      <div className="space-y-6">
        {!story && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t.ideaLabel}
              </label>
              <Textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t.ideaPlaceholder}
                rows={5}
                maxLength={1000}
                disabled={loading || limitReached}
                className="min-h-[140px] resize-none rounded-2xl bg-background/60"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            )}

            {limitReached ? (
              <div className="space-y-3">
                <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
                  {t.limitNote}
                </p>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/subscribe" })}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="size-4" />
                  {t.subscribeButton}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !idea.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
              >
                <Wand2 className="size-4" />
                {loading ? t.generatingButton : t.generateButton}
              </button>
            )}
          </>
        )}

        {story && (
          <div className="space-y-5">
            <h2 className="font-display text-2xl text-foreground">{t.storyHeading}</h2>
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-2xl border border-border bg-background/60 p-5 text-sm leading-relaxed text-foreground/90">
              {story}
            </div>
            <button
              type="button"
              onClick={handleNew}
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              {t.newStoryButton}
            </button>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t.backHome}
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

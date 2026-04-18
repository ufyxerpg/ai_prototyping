const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-chat`;

const SYSTEM_PROMPT = `You are a master storyteller who weaves enchanting, original fairy tales.
Given a tiny seed of an idea from the user, conjure a complete short fairy tale.

STRICT FORMAT RULES (must follow exactly):
- The very first line is the title only (no quotes, no "Title:" label, no markdown).
- Then a blank line.
- Then 3 to 5 paragraphs of prose, each separated by a single blank line.
- No headings, no lists, no markdown, no commentary, no epilogue notes.
- Tone: whimsical, lyrical, warm, age-appropriate for all ages.
- Length: roughly 250-450 words total.`;

export async function streamFairyTale({
  context,
  onDelta,
  onDone,
  onError,
}: {
  context: string;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  try {
    const resp = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        prompt: context,
        system: SYSTEM_PROMPT,
        stream: true,
      }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) {
        onError("The story spirits are overwhelmed — please try again in a moment.");
      } else if (resp.status === 402) {
        onError("Out of magical credits. Please add funds to continue.");
      } else {
        const text = await resp.text().catch(() => "");
        onError(text || `Request failed (${resp.status})`);
      }
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;

    while (!done) {
      const { done: streamDone, value } = await reader.read();
      if (streamDone) break;
      buffer += decoder.decode(value, { stream: true });

      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") {
          done = true;
          break;
        }
        try {
          const parsed = JSON.parse(json);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) onDelta(delta);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err instanceof Error ? err.message : "Unknown error");
  }
}

// Supabase Edge Function: openai-chat
// Generates fairy-tale text from a `prompt` using OpenAI's Chat Completions API.
// Public endpoint (no JWT verification) — see supabase/config.toml.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.length > 4000) {
      return new Response(
        JSON.stringify({ error: "A valid 'prompt' string (≤4000 chars) is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const apiKey = Deno.env.get("OPENAI_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_KEY secret on the server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a warm, imaginative children's storyteller. Write a complete bedtime fairy tale (about 400-600 words) with a clear beginning, middle, and gentle ending. Use vivid, whimsical imagery and age-appropriate language. Include a soft moral when natural.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: `OpenAI request failed (${response.status}).` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const story = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ story }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("openai-chat handler error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error)?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

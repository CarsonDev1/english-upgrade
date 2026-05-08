// Builds an AI-generated illustration URL for a vocabulary word.
// Uses Pollinations.ai (free, no API key). Prompt is intentionally short
// so the URL stays small (Pollinations 414s on long URL-encoded prompts)
// and the model has only one anchor: the word.

export interface ImagePromptContext {
  word: string;
  meaning_vi?: string | null;
  definition_en?: string | null;
  word_class?: string | null;
  // Concrete visual scene (produced by an LLM upstream). When present this is
  // what we draw — the word/definition fall back only if it's missing.
  visual_subject?: string | null;
}

const STYLE_HINT =
  "flat vector illustration, 2D cartoon style, simple shapes, bold dark outline, cel shading, vibrant flat colors, clean modern design, centered composition, plain white background";

const NEGATIVE_HINT =
  "no realistic photo, no 3D render, no blur, no watermark, no text, no words, no letters, no typography, no labels, no signs";

export function buildImagePrompt(ctx: ImagePromptContext): string {
  const word = ctx.word.trim();
  const def = (ctx.definition_en || "").trim().slice(0, 120);
  const subject = (ctx.visual_subject || "").trim()
    ? ctx.visual_subject!.trim()
    : def
      ? `${word} (${def})`
      : word;

  return `${STYLE_HINT} of ${subject}. ${NEGATIVE_HINT}.`;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h % 1_000_000;
}

export interface ImageUrlOptions {
  seed?: number;
  width?: number;
  height?: number;
  model?: "flux" | "turbo";
}

export function buildImageUrl(ctx: ImagePromptContext, opts: ImageUrlOptions = {}): string {
  const prompt = buildImagePrompt(ctx);
  const width = opts.width ?? 768;
  const height = opts.height ?? 768;
  const seed = opts.seed ?? hashSeed(ctx.word.toLowerCase());
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seed),
    nologo: "true",
    model: opts.model ?? "flux",
  });
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

// Warm the URL server-side so we know it actually returns an image before we
// hand it to the browser. Pollinations sometimes 502s the first request for a
// fresh prompt+seed pair; a single retry with the `turbo` model usually works.
export async function warmImageUrl(
  ctx: ImagePromptContext,
  opts: ImageUrlOptions = {},
  timeoutMs = 45_000,
): Promise<string> {
  const primary = buildImageUrl(ctx, opts);
  if (await ping(primary, timeoutMs)) return primary;

  const fallback = buildImageUrl(ctx, { ...opts, model: "turbo" });
  if (await ping(fallback, timeoutMs)) return fallback;

  // Last resort: return the primary URL anyway and let the browser try.
  return primary;
}

async function ping(url: string, timeoutMs: number): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "GET", signal: ctrl.signal });
    if (!res.ok) return false;
    const ct = res.headers.get("content-type") || "";
    return ct.startsWith("image/");
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

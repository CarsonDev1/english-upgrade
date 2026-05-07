import Groq from "groq-sdk";

let _client: Groq | null = null;

export function getGroq(): Groq {
  if (!_client) {
    _client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _client;
}

export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export interface GeneratedWord {
  word: string;
  ipa_uk: string;
  ipa_us: string;
  word_class: string;
  meaning_vi: string;
  definition_en: string;
  examples: { sentence: string; translation_vi: string }[];
}

const SYSTEM_PROMPT = `You are an expert English-Vietnamese lexicographer and IPA phonetician.
Given an English word or phrase, return STRICT JSON only — no markdown, no commentary.

Schema:
{
  "word": string,                              // canonical lowercased lemma
  "ipa_uk": string,                            // British IPA inside slashes, e.g. "/həˈləʊ/"
  "ipa_us": string,                            // American IPA inside slashes, e.g. "/həˈloʊ/"
  "word_class": string,                        // "noun" | "verb" | "adjective" | "adverb" | "phrase" | etc.
  "meaning_vi": string,                        // concise Vietnamese meaning (under 80 chars)
  "definition_en": string,                     // 1-sentence English definition
  "examples": [                                // exactly 3 natural example sentences
    { "sentence": string, "translation_vi": string }
  ]
}

Rules:
- IPA must be enclosed in /slashes/.
- Use authentic IPA characters (ə, ʊ, ɔː, ʃ, θ, ð, ɪ, etc.). Do NOT use ASCII approximations.
- For phrases, transcribe the whole phrase.
- If the word has multiple senses, pick the most common everyday sense.
- Vietnamese must be natural, not literal.
- Output ONLY the JSON object. No explanations.`;

export async function generateWord(input: string): Promise<GeneratedWord> {
  const client = getGroq();
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Word/phrase: ${input.trim()}` },
    ],
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error("Empty AI response");

  let parsed: GeneratedWord;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  if (!parsed.word || !parsed.ipa_uk) {
    throw new Error("AI response missing required fields");
  }
  if (!Array.isArray(parsed.examples)) parsed.examples = [];
  return parsed;
}

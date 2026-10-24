import { setGlobalDispatcher, ProxyAgent } from "undici";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";

if (process.env.NODE_ENV === "development") {
  setGlobalDispatcher(new ProxyAgent("http://127.0.0.1:10808"));
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt") ?? "سلام";

  const models = [
  "openrouter/free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "thinkingmachines/inkling:free",
];

let text = "";
let lastError;

for (const m of models) {
  const start = Date.now();
  try {
    const result = await generateText({
      model: openrouter(m),
      prompt,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(10000),
    });
    console.log(`OK ${m} in ${Date.now() - start}ms`);
    text = result.text;
    break;
  } catch (e) {
    console.log(`FAIL ${m} after ${Date.now() - start}ms:`, String(e?.message).slice(0, 150));
    lastError = e;
  }
}

if (!text) {
  return Response.json({ error: String(lastError) }, { status: 500 });
}
return Response.json({ text });
}




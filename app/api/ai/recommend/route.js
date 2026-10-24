import { setGlobalDispatcher, ProxyAgent } from "undici";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import Course from "@/models/Course"; 
import conectToDB from "@/configs/db";

if (process.env.NODE_ENV === "development") {
  setGlobalDispatcher(new ProxyAgent("http://127.0.0.1:10808"));
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const models = [
  "openrouter/free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
];

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const userNeed = String(body.need ?? "").trim().slice(0, 300);
  if (userNeed.length < 3) {
    return Response.json({ error: "متن خیلی کوتاه است" }, { status: 400 });
  }

  await conectToDB();

  const courses = await Course.find({ status: "published" })
    .select(
      "title slug shortDescription level price discountPrice isFree totalDuration thumbnail chapters.title"
    )
    .limit(60)
    .lean();

  const list = courses
    .map((c) => {
      const chapters = (c.chapters ?? [])
        .slice(0, 8)
        .map((ch) => ch.title)
        .join("، ");
      return `${c._id} | ${c.title} | ${c.level} | ${c.shortDescription} | فصل‌ها: ${chapters}`;
    })
    .join("\n");

  const prompt = `You are a course advisor for an online learning website. Below is a list of courses (format: id | title | level | short description | chapters).
User need (Persian): "${userNeed}"

Pick up to 3 courses that best match the need. Reply ONLY with a JSON array of ids, like ["id1","id2"]. If nothing matches, reply [].

Courses:
${list}`;

  let ids = null;
  for (const m of models) {
    try {
      const { text } = await generateText({
        model: openrouter(m),
        prompt,
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(15000),
      });
      const match = text.match(/\[[\s\S]*?\]/);
      if (match) {
        ids = JSON.parse(match[0]);
        break;
      }
    } catch (e) {
      console.log("FAIL", m, String(e?.message).slice(0, 120));
    }
  }

  if (ids === null) {
    return Response.json({ courses: [], aiFailed: true });
  }

  const byId = new Map(courses.map((c) => [String(c._id), c]));
  const result = ids
    .map((id) => byId.get(String(id)))
    .filter(Boolean)
    .slice(0, 3)
    .map((c) => ({
      id: String(c._id),
      title: c.title,
      slug: c.slug,
      shortDescription: c.shortDescription,
      level: c.level,
      price: c.price,
      discountPrice: c.discountPrice,
      isFree: c.isFree,
      totalDuration: c.totalDuration,
      thumbnail: c.thumbnail,
    }));

  return Response.json({ courses: result });
}
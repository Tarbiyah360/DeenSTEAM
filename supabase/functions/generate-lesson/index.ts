// supabase/functions/generate-lesson/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ---------------- Rate limiting (per IP, very simple, in-memory) ----------------

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10;

const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = Math.min(...recent);
    const resetTime = oldest + RATE_LIMIT_WINDOW;
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime,
    };
  }

  recent.push(now);
  rateLimitStore.set(ip, recent);

  return {
    allowed: true,
    remainingRequests: MAX_REQUESTS_PER_WINDOW - recent.length,
    resetTime: now + RATE_LIMIT_WINDOW,
  };
}

// ---------------- Curriculum topics & URLs ----------------

const ALLOWED_TOPICS = [
  "Forces and Magnets",
  "Light and Shadows",
  "Electricity",
  "Sound",
  "States of Matter",
  "Living Things and Their Habitats",
  "Plants",
  "Animals Including Humans",
  "Rocks and Soils",
  "Earth and Space",
  "Properties of Materials",
  "Evolution and Inheritance",
];

const curriculumUrls: Record<number, string> = {
  1: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-1-programme-of-study",
  2: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-2-programme-of-study",
  3: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-3-programme-of-study",
  4: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-4-programme-of-study",
  5: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-5-programme-of-study",
  6: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-6-programme-of-study",
};

// ---------------- Age-based depth guidance ----------------

function getDepthGuidance(age: number, year: number): string {
  if (age <= 6) {
    return `
For 5–6 year olds (Year ${year}):
- Use very simple, concrete language (short sentences, everyday words).
- Focus on what they can see, touch, hear, smell (sensory and playful).
- Explain ONE key idea only, with repetition and lots of examples.
- Every activity should feel like a game or story, not like an exam.
- Avoid abstract words like "hypothesis" or "variables".
`;
  } else if (age <= 8) {
    return `
For 7–8 year olds (Year ${year}):
- Use simple science words, but always explain them with real-life examples.
- Start introducing cause and effect ("if we do X, then Y happens").
- Activities should mix fun and thinking (predict → try → talk about result).
- Include questions children can actually answer out loud with their parents.
`;
  } else {
    return `
For 9–11 year olds (Year ${year}):
- Use more precise science language, but always tie it to daily life.
- Build on what they might have learned in earlier years.
- Let them compare, sort, measure, and record in simple tables.
- Add at least one moment where they reflect: "What surprised you? What did you expect?"
- Keep tone warm, friendly, and parent-child focused, not like a strict exam textbook.
`;
  }
}

// ---------------- Clients: Supabase + Gemini via OpenAI-compatible API ----------------

function getClients() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is missing");
  }
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Gemini through OpenAI-compatible endpoint
  const ai = new OpenAI({
    apiKey: geminiApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  return { supabase, ai };
}

// ---------------- (Unused now) Image generation with Gemini (Imagen) ----------------
// keeping this in case you want to go back later, but we no longer CALL it anywhere
async function generateImage(ai: OpenAI, prompt: string): Promise<string> {
  try {
    const result = await ai.images.generate({
      model: "imagen-3.0-generate-002",
      prompt,
      n: 1,
      response_format: "b64_json",
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      console.warn("No b64 image data returned from Gemini");
      return "";
    }

    return `data:image/png;base64,${b64}`;
  } catch (error) {
    console.error("Image generation error:", error);
    return "";
  }
}

// ---------------- NEW: Static image attachment ----------------

// turn "Plants" or "Forces and Magnets" into "plants" / "forces-and-magnets"
function slugifyTopic(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Attach static image URLs based on topic + activity + step.
 *
 * Expected filenames in your Vite public folder:
 *   public/lesson-images/<topic-slug>-activity1-step1.png
 *   public/lesson-images/<topic-slug>-activity1-step2.png
 *   ...
 *   public/lesson-images/<topic-slug>-activity2-step1.png
 *   ...
 *   public/lesson-images/<topic-slug>-activity1-final.png
 *   public/lesson-images/<topic-slug>-activity2-final.png
 *
 * Example for topic "Plants" (slug "plants"):
 *   /lesson-images/plants-activity1-step1.png
 *   /lesson-images/plants-activity1-final.png
 */
function attachStaticImageUrls(lesson: any, topic: string) {
  if (!lesson || !Array.isArray(lesson.activities)) return lesson;

  const slug = slugifyTopic(topic);

  lesson.activities.forEach((activity: any, aIndex: number) => {
    const activityNumber = aIndex + 1;

    if (Array.isArray(activity.steps)) {
      activity.steps.forEach((step: any, sIndex: number) => {
        const stepNumber = sIndex + 1;
        step.imageUrl = `/lesson-images/${slug}/${slug}-activity${activityNumber}-step${stepNumber}.png`;
      });
    }

    activity.finalImageUrl = `/lesson-images/${slug}/${slug}-activity${activityNumber}-final.png`;
  });

  return lesson;
}

// ---------------- Main handler ----------------

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIP =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Rate limit
    const rate = checkRateLimit(clientIP);
    if (!rate.allowed) {
      const mins = Math.ceil((rate.resetTime - Date.now()) / (60 * 1000));
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: `You can generate up to ${MAX_REQUESTS_PER_WINDOW} lessons per hour. Try again in about ${mins} minute${mins !== 1 ? "s" : ""}.`,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const { age, year, topic } = await req.json();

    console.log(
      `[${new Date().toISOString()}] Lesson request from ${clientIP} - Topic: "${topic}", Age: ${age}, Year: ${year}, Remaining: ${rate.remainingRequests}`,
    );

    // Validate age & year
    if (!age || !year || age < 5 || age > 11 || year < 1 || year > 6) {
      return new Response(
        JSON.stringify({ error: "Valid age (5–11) and year (1–6) are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate topic
    if (!topic || typeof topic !== "string") {
      return new Response(
        JSON.stringify({
          error: "Topic is required and must be a string",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!ALLOWED_TOPICS.includes(topic)) {
      return new Response(
        JSON.stringify({
          error: "Invalid topic. Please select from the curriculum topics.",
          allowedTopics: ALLOWED_TOPICS,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { supabase, ai } = getClients();

    const curriculumRef = curriculumUrls[year] || "UK National Curriculum";
    const depthGuidance = getDepthGuidance(age, year);

    // ---------------- Cache check ----------------
    console.log(
      `[${clientIP}] Checking cache age=${age}, year=${year}, topic="${topic}"`,
    );

    const { data: cached, error: cacheError } = await supabase
      .from("saved_lessons")
      .select("lesson_data")
      .eq("age", age)
      .eq("year", year)
      .eq("topic", topic)
      .maybeSingle();

    if (cacheError) {
      console.error("Cache lookup error:", cacheError);
    }

    if (cached?.lesson_data) {
      console.log(`[${clientIP}] Cache HIT for topic "${topic}"`);
      // make sure image URLs are present even for older cached entries
      const lessonFromCache = attachStaticImageUrls(
        cached.lesson_data,
        topic,
      );
      return new Response(JSON.stringify({ lesson: lessonFromCache }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-Cache": "HIT",
        },
      });
    }

    console.log(`[${clientIP}] Cache MISS for topic "${topic}"`);

    // ---------------- Ask Gemini for structured JSON (no images yet) ----------------

    const completion = await ai.chat.completions.create({
      model: "gemini-2.0-flash",
      temperature: 0.4,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "lesson_plan",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              ageGroup: { type: "string" },
              objectives: {
                type: "array",
                items: { type: "string" },
                minItems: 4,
              },
              materials: {
                type: "array",
                items: { type: "string" },
                minItems: 6,
              },
              activities: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    duration: { type: "string" },
                    description: { type: "string" },
                    steps: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          stepNumber: { type: "integer" },
                          instruction: { type: "string" },
                          imagePrompt: { type: "string" },
                          imageUrl: { type: "string" },
                        },
                        required: [
                          "stepNumber",
                          "instruction",
                          "imagePrompt",
                          "imageUrl",
                        ],
                      },
                      minItems: 3,
                    },
                    finalImagePrompt: { type: "string" },
                    finalImageUrl: { type: "string" },
                  },
                  required: [
                    "title",
                    "duration",
                    "description",
                    "steps",
                    "finalImagePrompt",
                    "finalImageUrl",
                  ],
                },
                minItems: 2,
              },
              tryAtHome: {
                type: "object",
                additionalProperties: false,
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                },
                required: ["title", "description"],
              },
              reflection: { type: "string" },
              scientist: {
                type: "object",
                additionalProperties: false,
                properties: {
                  name: { type: "string" },
                  link: {
                    type: "string",
                    enum: [
                      "/scientist/al-khwarizmi",
                      "/scientist/al-battani",
                      "/scientist/ibn-sina",
                      "/scientist/jabir-ibn-hayyan",
                      "/scientist/al-zahrawi",
                      "/scientist/fatima-al-fihri",
                      "/scientist/abbas-ibn-firnas",
                      "/scientist/al-jazari",
                    ],
                  },
                  biography: { type: "string" },
                },
                required: ["name", "link", "biography"],
              },
            },
            required: [
              "title",
              "ageGroup",
              "objectives",
              "materials",
              "activities",
              "tryAtHome",
              "reflection",
              "scientist",
            ],
          },
        },
      },
      messages: [
        {
          role: "system",
          content: `
You are an expert DeenSTEAM lesson designer.

CONTEXT:
- Design a single detailed Year ${year} Science lesson on "${topic}" for a ${age}-year-old Muslim child.
- The lesson is used by a MOTHER teaching her child at home.
- It must feel warm, practical, and spiritually uplifting.

CURRICULUM:
- Follow the Year ${year} UK Science curriculum (${curriculumRef}).
- Do NOT copy text from the curriculum page or sound like a Google snippet.
- Always paraphrase in child-friendly language.
- Explanations must be wrapped in mini-scenarios, questions, and real-life situations, not just dry facts.

AGE-BASED DEPTH:
${depthGuidance}

UNIQUENESS RULES (VERY IMPORTANT):
- Never start with a dry definition. Hook the child with a scenario:
  e.g. "Imagine you drop your toy..." or "Have you ever seen...?"
- Use examples from a Muslim child's world: home, masjid, wudu, salah times, Ramadan, Eid, nature walks.
- Do NOT repeat the same phrasing or structure across activities.
- Make the craft activity something a child would proudly show to a parent or hang on the wall.
- Avoid generic closings like "In conclusion", "Overall", "In this lesson we learnt".

DEENSTEAM FLAVOUR:
- Gently connect science to Allah's creation: order, beauty, balance, mercy.
- Do NOT invent specific Qur'an ayat or hadith references. Keep it general and respectful.
- Encourage the parent to say phrases like "SubhanAllah" and "Alhamdulillah" with the child.

IMAGE FIELDS:
- For every step, provide a short "imagePrompt" for a simple child-friendly illustration (no text in the image).
- For every activity, provide a "finalImagePrompt" describing the finished craft/result.
- If you don't know an imageUrl, set it to an empty string "" (backend will replace it).

IMPORTANT:
- The JSON MUST follow the provided schema exactly.
- Be generous with objectives, descriptions, and steps, but keep each sentence simple and clear.
        `.trim(),
        },
        {
          role: "user",
          content: "Create the DeenSTEAM lesson plan now as JSON only.",
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";

    let lesson: any;
    try {
      lesson = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse Gemini JSON:", raw);
      throw new Error("AI did not return valid JSON");
    }

    console.log(
      `[${clientIP}] Lesson structure generated, now attaching static image URLs...`,
    );

    // --------- NEW: no remote image generation, just attach static URLs ------
    lesson = attachStaticImageUrls(lesson, topic);

    console.log(
      `[${clientIP}] Lesson generated with static images. Saving to cache...`,
    );

    // ---------------- Save to cache table ----------------
    const { error: saveError } = await supabase.from("saved_lessons").insert({
      age,
      year,
      topic,
      lesson_data: lesson,
    });

    if (saveError) {
      console.error("Failed to save lesson to cache:", saveError);
    } else {
      console.log(
        `[${clientIP}] Lesson cached for age=${age}, year=${year}, topic="${topic}"`,
      );
    }

    // ---------------- Return to frontend ----------------
    return new Response(JSON.stringify({ lesson }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error in generate-lesson function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
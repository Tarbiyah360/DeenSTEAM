// supabase/functions/generate-lesson/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.79.0";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ---------- Rate limiting ----------
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10;

const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  const valid = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW);

  if (valid.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = Math.min(...valid);
    const resetTime = oldest + RATE_LIMIT_WINDOW;
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime,
    };
  }

  valid.push(now);
  rateLimitStore.set(ip, valid);

  return {
    allowed: true,
    remainingRequests: MAX_REQUESTS_PER_WINDOW - valid.length,
    resetTime: now + RATE_LIMIT_WINDOW,
  };
}

// ---------- Curriculum topics ----------
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

// ---------- Edge function ----------
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
    const limit = checkRateLimit(clientIP);
    if (!limit.allowed) {
      const minutes = Math.ceil(
        (limit.resetTime - Date.now()) / (60 * 1000),
      );
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: `You can generate up to ${MAX_REQUESTS_PER_WINDOW} lessons per hour. Please try again in ${minutes} minute${minutes !== 1 ? "s" : ""
            }.`,
          resetTime: new Date(limit.resetTime).toISOString(),
          remainingRequests: 0,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": limit.resetTime.toString(),
          },
        },
      );
    }

    const { age, year, topic } = await req.json();

    console.log(
      `[${new Date().toISOString()}] generate-lesson from ${clientIP} – topic="${topic}", age=${age}, year=${year}`,
    );

    // ---------- Validate input ----------
    if (!age || !year || age < 5 || age > 11 || year < 1 || year > 6) {
      return new Response(
        JSON.stringify({
          error: "Valid age (5–11) and year (1–6) are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

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

    // ---------- Env + clients ----------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase configuration is missing");
    }
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // ---------- Cache lookup ----------
    const { data: cachedLesson, error: cacheError } = await supabase
      .from("saved_lessons")
      .select("lesson_data")
      .eq("age", age)
      .eq("year", year)
      .eq("topic", topic)
      .maybeSingle();

    if (cacheError) {
      console.error("Cache lookup error:", cacheError);
    }

    if (cachedLesson?.lesson_data) {
      console.log(`[${clientIP}] Cache HIT`);
      return new Response(
        JSON.stringify({ lesson: cachedLesson.lesson_data }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-Cache": "HIT",
            "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
            "X-RateLimit-Remaining": limit.remainingRequests.toString(),
            "X-RateLimit-Reset": limit.resetTime.toString(),
          },
        },
      );
    }

    console.log(`[${clientIP}] Cache MISS – generating new lesson`);

    const curriculumRef = curriculumUrls[year] || "UK National Curriculum";

    // ---------- 1. Ask OpenAI for the lesson STRUCTURE (no images yet) ----------
    const systemPrompt = `
You are a DeenSTEAM lesson designer.

Create ONE detailed Year ${year} Science lesson plan about "${topic}"
for a ${age}-year-old child, following the UK National Curriculum.

CURRICULUM REFERENCE: ${curriculumRef}

RULES (VERY IMPORTANT):
- Return ONLY valid JSON with this structure:

{
  "title": string,
  "ageGroup": string,
  "objectives": string[],
  "materials": string[],
  "activities": [
    {
      "title": string,
      "duration": string,
      "description": string,
      "steps": [
        {
          "stepNumber": number,
          "instruction": string,
          "imagePrompt": string
        }
      ],
      "finalImagePrompt": string
    }
  ],
  "tryAtHome": {
    "title": string,
    "description": string
  },
  "reflection": string,
  "scientist": {
    "name": string,
    "link": string,
    "biography": string
  }
}

- Exactly 2 activities. ONE of them MUST be a clear CRAFT (making or building).
- Each activity has 3–5 steps.
- imagePrompt and finalImagePrompt must describe simple black-and-white clipart line drawings, hands only, child-friendly, no faces.
- "link" MUST be one of:
  "/scientist/al-khwarizmi",
  "/scientist/al-battani",
  "/scientist/ibn-sina",
  "/scientist/jabir-ibn-hayyan",
  "/scientist/al-zahrawi",
  "/scientist/fatima-al-fihri",
  "/scientist/abbas-ibn-firnas",
  "/scientist/al-jazari"
- The scientist's biography and work must connect logically to the topic "${topic}".
- Reflection should be 1–2 short sentences linking the science to Allah's creation.
- Do NOT invent exact Qur'an ayat or hadith text. Keep references general (e.g. "a verse in the Qur'an reminds us that...").
- Use simple language suitable for a Muslim child of ${age} years old.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "Generate the complete lesson plan JSON now. Do not include any text outside the JSON.",
        },
      ],
    });

    const rawContent = completion.choices?.[0]?.message?.content || "{}";

    let baseLesson: any;
    try {
      baseLesson = JSON.parse(rawContent);
    } catch (err) {
      console.error("Failed to parse JSON from OpenAI:", rawContent);
      throw new Error("AI did not return valid JSON");
    }

    console.log("Lesson structure generated. Now generating images...");

    // ---------- 2. Generate images for each step & final craft ----------
    const generateImageUrl = async (prompt: string): Promise<string> => {
      if (!prompt) return "";
      try {
        const img = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "512x512",
        });
        const url = img.data?.[0]?.url || "";
        return url;
      } catch (err) {
        console.error("Image generation error:", err);
        return "";
      }
    };

    for (const activity of baseLesson.activities ?? []) {
      // Step images
      if (Array.isArray(activity.steps)) {
        for (const step of activity.steps) {
          step.imageUrl = await generateImageUrl(step.imagePrompt);
        }
      }

      // Final result image
      if (activity.finalImagePrompt) {
        activity.finalImageUrl = await generateImageUrl(
          activity.finalImagePrompt,
        );
      }
    }

    const lessonWithImages = baseLesson;

    // ---------- 3. Save to cache ----------
    const { error: saveError } = await supabase.from("saved_lessons").insert({
      age,
      year,
      topic,
      lesson_data: lessonWithImages,
    });

    if (saveError) {
      console.error("Failed to save lesson to cache:", saveError);
    }

    console.log(`[${clientIP}] Lesson generated and cached`);

    // ---------- 4. Return to frontend ----------
    return new Response(JSON.stringify({ lesson: lessonWithImages }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "X-Cache": "MISS",
        "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
        "X-RateLimit-Remaining": limit.remainingRequests.toString(),
        "X-RateLimit-Reset": limit.resetTime.toString(),
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
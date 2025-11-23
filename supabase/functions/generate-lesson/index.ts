import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Very simple topic safety filter for child-facing lessons
const BLOCKED_KEYWORDS = [
  // sexual / adult themes
  "sex",
  "sexual",
  "porn",
  "pornography",
  "nude",
  "naked",
  "lesbian",
  "gay",
  "homosexual",
  "lgbt",
  "transgender",
  "bisexual",
  "dating",
  "boyfriend",
  "girlfriend",
  "kiss",
  "romance",
  "romantic",
  "erotic",
  // drugs / alcohol
  "alcohol",
  "wine",
  "beer",
  "drugs",
  "cocaine",
  "marijuana",
  "weed",
  // violence / self-harm (you can tune these)
  "suicide",
  "self-harm",
  "murder",
  "kill",
  "killing",
  "terrorist",
  // non-Islamic religion topics for kids
  "christianity",
  "hinduism",
  "buddhism",
  "atheism",
  "idol worship",
  "cross",
  "church",
  "temple",
];

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const age = Number(body.age);
  const year = Number(body.year);

  // Keep original topic string (for UX) and a lowercased version for filtering
  const rawTopic: string | undefined =
    typeof body.topic === "string"
      ? body.topic
      : typeof body.subject === "string"
      ? body.subject
      : undefined;

  const normalizedTopic = rawTopic?.toLowerCase().trim();

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

  // 🔐 Safety filter: block clearly unsuitable topics for child lessons
  if (normalizedTopic) {
    const isBlocked = BLOCKED_KEYWORDS.some((word) =>
      normalizedTopic.includes(word)
    );

    if (isBlocked) {
      console.warn("Blocked topic received:", rawTopic);

      return new Response(
        JSON.stringify({
          error:
            "This topic is not supported for child lessons in this app. Please choose a different, child-safe topic (e.g. plants, animals, light, space, weather).",
          code: "BLOCKED_TOPIC",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return new Response(
      JSON.stringify({
        error: "Server misconfigured: OPENAI_API_KEY not set",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const openai = new OpenAI({ apiKey });

  const SYSTEM_PROMPT = `
You are an expert DeenSTEAM educator creating Islamic-friendly, child-safe STEM lesson plans.

GENERAL RULES
- Your primary goal is to create ONE structured, age-appropriate science/STEAM lesson for children.
- The audience are Muslim children, supervised by their mothers.
- The app is strictly child-focused and Islamic-aligned. Content must be modest, age-appropriate, and aligned with Islamic values.

TOPIC HANDLING
- If the user provides a topic, you MUST keep that topic wording and build the lesson around it. Do NOT silently change the topic.
- If the topic is unusual for science (e.g. "heaven"), keep the same wording but connect it to the natural world in a gentle, reflective way (e.g. sky, stars, creation, feelings) suitable for the child's age.
- If the input topic is clearly unsuitable for children (sexual content, dating, pornography, LGBTQ themes, explicit violence, non-Islamic worship rituals), you MUST NOT create a lesson. Instead, respond with a JSON object of the form:
{
  "error": "UNSUITABLE_TOPIC",
  "message": "This topic is not suitable for a child-focused Islamic lesson."
}
and nothing else.

ISLAMIC SAFETY
- You may refer to Islamic values (e.g. gratitude, amanah, khalifah on earth, reflection on Allah's creation).
- Do NOT invent exact Qur'an ayat or hadith text.
- Do NOT fabricate surah names or hadith references.
- Keep references general unless you are explicitly given the text and source.
- Do NOT discuss intimate sexual details, LGBTQ identities, dating culture, or romantic relationships in lessons for children.

RETURN FORMAT
Return JSON ONLY with this structure when the topic is acceptable:

{
  "title": string,
  "ageGroup": string,
  "yearGroup": string,
  "topic": string,
  "objectives": string[],
  "materials": string[],
  "activities": [
    {
      "title": string,
      "description": string,
      "imagePrompt": string
    }
  ],
  "tryAtHome": {
    "title": string,
    "description": string,
    "imagePrompt": string
  },
  "reflection": string,
  "scientists": [
    {
      "name": string,
      "contribution": string
    }
  ],
  "islamicIntegration": {
    "theme": string,
    "summary": string,
    "reflectionPrompt": string
  }
}
`.trim();

  const USER_MESSAGE = rawTopic
    ? `
Create an engaging lesson for a child.

Child age: ${age}
Year group: ${year}
Use this EXACT topic: "${rawTopic}". Do NOT change the topic wording.
If it is not normally a science topic, connect it gently to science/STEAM or the natural world (e.g. sky, earth, animals, creation) in a way that is suitable for a Muslim child of this age.
`.trim()
    : `
Create an engaging science/STEAM lesson.

Child age: ${age}
Year group: ${year}
Choose a suitable general science topic for this age (e.g. plants, animals, light, sound, weather, simple forces).
`.trim();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_MESSAGE },
      ],
    });

    const content = completion.choices?.[0]?.message?.content || "{}";

    // Parse the JSON string and wrap it as { lesson: ... }
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse OpenAI JSON:", content);
      return new Response(
        JSON.stringify({ error: "Invalid JSON from model" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // If model decided the topic is unsuitable, pass the error through
    if (parsed?.error) {
      return new Response(JSON.stringify(parsed), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lesson = parsed;

    return new Response(JSON.stringify({ lesson }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate lesson" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
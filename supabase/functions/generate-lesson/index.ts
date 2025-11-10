import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const validateTopic = (topic: string): { valid: boolean; error?: string } => {
  if (!topic || typeof topic !== 'string') {
    return { valid: false, error: "Topic is required" };
  }
  
  const trimmedTopic = topic.trim();
  
  if (trimmedTopic.length === 0) {
    return { valid: false, error: "Topic cannot be empty" };
  }
  
  if (trimmedTopic.length > 100) {
    return { valid: false, error: "Topic must be less than 100 characters" };
  }
  
  // Allow alphanumeric, spaces, and basic punctuation
  const validCharPattern = /^[a-zA-Z0-9\s,.\-']+$/;
  if (!validCharPattern.test(trimmedTopic)) {
    return { valid: false, error: "Topic contains invalid characters" };
  }
  
  return { valid: true };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();

    // Validate topic input
    const validation = validateTopic(topic);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const sanitizedTopic = topic.trim();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating lesson for topic: ${sanitizedTopic}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert Islamic educator combining tarbiyah (Islamic upbringing) with STEAM learning.

For any given topic, create a comprehensive lesson with these 4 components:

1. **Qur'anic Verse or Story**: Find a relevant verse from the Qur'an or a story from Islamic tradition that relates to the topic. Include the Surah name and verse number. Make it engaging for children.

2. **Muslim Inventor/Scientist**: Identify a Muslim scholar, scientist, or inventor from Islamic history (like those featured in 1001 Inventions) who contributed to this field. Explain their contribution in simple terms.

3. **Hands-on Activity**: Suggest a fun, practical activity children can do to explore this topic. Make it age-appropriate (5-12 years) and doable at home with common materials.

4. **Reflection and Dua**: Provide a thoughtful question for reflection and a simple dua (prayer) related to the topic that children can memorize.

Keep each section to 2-4 sentences. Be warm, encouraging, and educational.

Return your response as a JSON object with these keys: verse, inventor, activity, reflection`,
          },
          {
            role: "user",
            content: `Create a lesson about: ${sanitizedTopic}`,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("AI API error:", response.status, errorData);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const lessonContent = data.choices[0].message.content;
    const lesson = JSON.parse(lessonContent);

    console.log("Successfully generated lesson");

    return new Response(
      JSON.stringify({ lesson }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-lesson function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
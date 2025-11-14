import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating daily parenting wisdom...");

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
            content: `You are a wise Islamic parenting advisor. Provide daily guidance for Muslim parents that:
- Is rooted in Qur'anic teachings and Hadith (with citations)
- Addresses common parenting challenges
- Combines spiritual wisdom with practical advice
- Is warm, supportive, and nurturing in tone
- Is 3-5 paragraphs long
- Includes a specific action item parents can implement today

Focus on topics like: character building, faith development, emotional intelligence, curiosity nurturing, patience, gratitude, and balanced discipline.`,
          },
          {
            role: "user",
            content: "Provide today's parenting wisdom and guidance.",
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("AI API error:", response.status, errorData);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const wisdom = data.choices[0].message.content;

    console.log("Successfully generated wisdom");

    return new Response(
      JSON.stringify({ wisdom }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in get-daily-wisdom function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
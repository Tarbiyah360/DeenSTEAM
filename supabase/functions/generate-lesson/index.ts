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
    const { topic, age, year } = await req.json();

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
    
    if (!age || !year || age < 5 || age > 11 || year < 1 || year > 6) {
      return new Response(
        JSON.stringify({ error: "Valid age (5-11) and year (1-6) are required" }),
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

    console.log(`Generating lesson for topic: ${sanitizedTopic}, age: ${age}, year: ${year}`);

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
            content: `You are an expert Islamic educator creating DeenSTEAM lesson plans that combine STEM education with Islamic values for UK primary school children.

Create a comprehensive, child-friendly lesson plan in the style shown in the example. The lesson must be:
- Age-appropriate for ${age} year old children in Year ${year}
- Aligned with UK National Curriculum Science standards for Year ${year}
- Written in a warm, encouraging tone speaking directly to children
- Enriched with Islamic reflections on Allah's creation

Return a JSON object with these keys:

{
  "title": "Exciting, child-friendly title (e.g., 'Super Sound Explorers!')",
  "ageGroup": "Year ${year} Science Lesson Plan",
  "objectives": ["Array of 4-5 specific learning objectives starting with action verbs like 'Understand', 'Identify', 'Explore', 'Learn'"],
  "materials": ["Array of 6-8 common household items needed, simple and specific"],
  "activities": [
    {
      "title": "Activity name (e.g., 'Vibration Station!')",
      "description": "Detailed, step-by-step instructions speaking to children. Make it fun and engaging with questions and observations to guide them."
    },
    {
      "title": "Second activity name",
      "description": "Another hands-on activity with clear instructions"
    }
  ],
  "tryAtHome": {
    "title": "Home activity name",
    "description": "A fun experiment or project children can do at home with adult help. Include what to observe and questions to explore."
  },
  "reflection": "A thoughtful Islamic reflection connecting the topic to Allah's creation and wisdom. Include a simple dua or reminder to be grateful.",
  "scientist": {
    "name": "Name of relevant Muslim scientist from history",
    "link": "/scientist/scientist-kebab-case"
  }
}

Important guidelines:
- Keep instructions clear and age-appropriate
- Use engaging language that speaks to children
- Include observations and questions in activity descriptions
- Make connections to real-world applications
- Ensure Islamic reflections are meaningful and age-appropriate
- Activities should use common household items
- Link to one of these scientists if relevant: /scientist/al-battani, /scientist/jabir-ibn-hayyan, /scientist/ibn-sina, /scientist/al-khwarizmi`,
          },
          {
            role: "user",
            content: `Create a Year ${year} Science lesson plan about: ${sanitizedTopic}`,
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
    let lessonContent = data.choices[0].message.content;
    
    // Log raw response for debugging
    console.log("Raw AI response length:", lessonContent.length);
    
    // Strip markdown code fences if present
    lessonContent = lessonContent.trim();
    if (lessonContent.startsWith('```json')) {
      lessonContent = lessonContent.slice(7); // Remove ```json
    } else if (lessonContent.startsWith('```')) {
      lessonContent = lessonContent.slice(3); // Remove ```
    }
    if (lessonContent.endsWith('```')) {
      lessonContent = lessonContent.slice(0, -3); // Remove trailing ```
    }
    lessonContent = lessonContent.trim();
    
    // Parse JSON with better error handling
    let lesson;
    try {
      lesson = JSON.parse(lessonContent);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Content that failed to parse (first 500 chars):", lessonContent.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

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
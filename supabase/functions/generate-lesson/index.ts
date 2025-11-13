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
    const { age, year } = await req.json();
    
    if (!age || !year || age < 5 || age > 11 || year < 1 || year > 6) {
      return new Response(
        JSON.stringify({ error: "Valid age (5-11) and year (1-6) are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating lesson for age: ${age}, year: ${year}`);
    
    // Map year to curriculum URL
    const curriculumUrls: Record<number, string> = {
      1: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-1-programme-of-study",
      2: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-2-programme-of-study",
      3: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-3-programme-of-study",
      4: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-4-programme-of-study",
      5: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-5-programme-of-study",
      6: "https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study#year-6-programme-of-study",
    };

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

Create a comprehensive, child-friendly lesson plan for Year ${year} children (age ${age}) based on the UK National Curriculum for Science.

CURRICULUM REFERENCE: ${curriculumUrls[year]}

IMPORTANT REQUIREMENTS:
1. Select an appropriate science topic from the Year ${year} UK National Curriculum
2. ONE of the two activities MUST be a hands-on CRAFT activity suitable for children (e.g., making a model, creating art, building something)
3. Align strictly with curriculum standards for Year ${year}
4. Use simple, child-friendly language appropriate for ${age} year olds
5. Include Islamic reflections connecting the science to Allah's creation with Quranic verses where relevant
6. Reference Muslim scientists from the Islamic Golden Age (1001 Inventions) and their contributions to this field
7. Activities should be hands-on, engaging, and age-appropriate
8. Include materials that are easily accessible at home or school
9. Include praise (SubhanAllah, Alhamdulillah) and duas (prayers) in reflections

REFERENCES FOR INSPIRATION:
- Scientific facts mentioned in the Quran (natural phenomena, creation, heavens and earth)
- 1001 Inventions and contributions from Muslim heritage
- Teaching with Islamic values of curiosity, observation, and gratitude

Return ONLY a JSON object (no markdown, no code blocks) with this EXACT structure:

{
  "title": "Exciting, child-friendly title speaking to children (e.g., 'Amazing Plants Around Us!' or 'Super Sound Explorers!')",
  "ageGroup": "Year ${year} (Ages ${age}-${age + 1})",
  "objectives": ["Array of 4-5 specific learning objectives aligned with UK curriculum", "Start with action verbs like 'Understand', 'Identify', 'Explore', 'Learn'", "Make them achievable for this age group"],
  "materials": ["List 6-8 common household or school items needed", "Be specific (e.g., 'plastic bottle' not 'container')", "Keep items simple and accessible"],
  "activities": [
    {
      "title": "Activity 1 Title (ONE MUST BE A CRAFT - making/building/creating something physical)",
      "description": "Detailed step-by-step instructions speaking directly to children. Make it fun and engaging with questions and observations to guide them. If this is the craft activity, clearly describe what they will make/build/create."
    },
    {
      "title": "Activity 2 Title (if Activity 1 wasn't a craft, THIS MUST BE A CRAFT)",
      "description": "Another hands-on activity with clear instructions. Include what children will observe, discover, or create."
    }
  ],
  "tryAtHome": {
    "title": "Fun Home Activity Title",
    "description": "A simple experiment or project children can do at home with adult supervision. Include what to observe, questions to explore, and an Islamic reflection connecting to Allah's creation with praise (SubhanAllah/Alhamdulillah) and a short dua."
  },
  "reflection": "Meaningful Islamic reflection connecting this science topic to Allah's perfect creation. Include a relevant Quranic verse or concept if applicable (e.g., signs in nature, balance in creation). End with SubhanAllah or Alhamdulillah and encourage gratitude through a short dua.",
  "scientist": {
    "name": "Name of a relevant Muslim scientist from the Islamic Golden Age who contributed to this field (from 1001 Inventions)",
    "link": "/al-khwarizmi or /al-battani or /ibn-sina or /jabir-ibn-hayyan or /al-zahrawi or /fatima-al-fihri or /abbas-ibn-firnas or /al-jazari (choose the most relevant)"
  }
}

CRITICAL: Ensure ONE activity is clearly a CRAFT (making, building, creating something tangible).
Make it engaging, educational, spiritually enriching, and perfectly suited for ${age} year old children!`,
          },
          {
            role: "user",
            content: `Create an engaging Year ${year} Science lesson plan based on the UK National Curriculum. Remember: ONE activity must be a craft activity where children make or build something!`,
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
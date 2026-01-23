import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { overallExperience, projectType, delivery, communication, optionalComment, wouldRecommend } = await req.json();

    // Validate required fields
    if (!overallExperience || !projectType || !delivery || !communication || !wouldRecommend) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an AI that generates professional client reviews for a portfolio website. A client will provide their selections from a form and optionally a short comment.

Your task is to take the selected options and optional comment, and generate a polished, readable paragraph as a client testimonial. Include all selected options naturally in the text, include the optional comment if provided, and end with the recommendation statement.

Guidelines:
- Keep the tone professional yet warm
- Make it sound natural and authentic
- Include all form selections naturally in the flow
- If there's an optional comment, weave it in seamlessly
- Keep it to 2-3 sentences
- End with the recommendation naturally`;

    const userPrompt = `Generate a professional testimonial with these details:
- Overall Experience: ${overallExperience}
- Project Type: ${projectType}
- Delivery: ${delivery}
- Communication: ${communication}
- Optional Comment: ${optionalComment || "None provided"}
- Would Recommend: ${wouldRecommend}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate review" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedReview = data.choices[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ review: generatedReview.trim() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating review:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
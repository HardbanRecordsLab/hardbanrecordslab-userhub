import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, contentType, channel, generateImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    switch (contentType) {
      case "social_post":
        systemPrompt = "Jesteś ekspertem od social media. Tworzysz angażujące posty z odpowiednimi hashtagami i emoji. Dostosowujesz styl do platformy.";
        break;
      case "blog_article":
        systemPrompt = "Jesteś copywriterem specjalizującym się w artykułach blogowych. Tworzysz wartościowe, SEO-friendly treści z nagłówkami i strukturą.";
        break;
      case "email":
        systemPrompt = "Jesteś ekspertem email marketingu. Tworzysz przekonujące emaile z jasnym CTA i personalizacją.";
        break;
      case "ad_copy":
        systemPrompt = "Jesteś copywriterem reklamowym. Tworzysz krótkie, przekonujące teksty reklamowe z silnym przekazem i CTA.";
        break;
      default:
        systemPrompt = "Jesteś kreatywnym copywriterem. Tworzysz wysokiej jakości treści marketingowe.";
    }

    systemPrompt += ` Odpowiadaj po polsku. ${channel ? `Treść ma być dostosowana do platformy: ${channel}` : ''}`;

    // Generate text content
    const textResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!textResponse.ok) {
      throw new Error("Error generating text content");
    }

    const textData = await textResponse.json();
    const generatedText = textData.choices?.[0]?.message?.content || "";

    let imageUrl = null;

    // Generate image if requested
    if (generateImage) {
      const imagePrompt = `Create a high-quality, professional marketing image for: ${prompt}. Ultra high resolution, professional photography style.`;
      
      const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: imagePrompt
            }
          ],
          modalities: ["image", "text"]
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
      }
    }

    return new Response(
      JSON.stringify({ 
        content: generatedText,
        imageUrl: imageUrl
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-content:", error);
    const errorMessage = error instanceof Error ? error.message : "Wystąpił błąd podczas generowania treści";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
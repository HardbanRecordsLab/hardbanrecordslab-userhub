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
    const { prompt, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    switch (type) {
      case "marketing":
        systemPrompt = "Jesteś ekspertem marketingu muzycznego i cyfrowego. Tworzysz strategie marketingowe, plany kampanii i treści promocyjne dla artystów i twórców. Odpowiadaj po polsku.";
        break;
      case "content":
        systemPrompt = "Jesteś kreatywnym copywriterem specjalizującym się w branży muzycznej i wydawniczej. Tworzysz angażujące posty, opisy i treści marketingowe. Odpowiadaj po polsku.";
        break;
      case "strategy":
        systemPrompt = "Jesteś strategiem biznesowym dla branży kreatywnej. Analizujesz trendy, tworzysz plany rozwoju i doradzasz w kwestiach monetyzacji. Odpowiadaj po polsku.";
        break;
      default:
        systemPrompt = "Jesteś pomocnym asystentem AI dla platformy HardbanRecords Lab. Pomagasz twórcom w zarządzaniu ich karierą. Odpowiadaj po polsku.";
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limit zapytań przekroczony. Spróbuj ponownie później." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Wymagana doładowanie konta Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI Gateway error");
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in AI content generation:", error);
    const errorMessage = error instanceof Error ? error.message : "Wystąpił błąd podczas generowania treści";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
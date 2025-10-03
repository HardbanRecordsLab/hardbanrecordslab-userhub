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
    const { 
      companyName, 
      industry, 
      productService, 
      targetAudience, 
      goals, 
      budget, 
      timeline 
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Jesteś ekspertem strategii marketingowej. Tworzysz kompleksowe strategie marketingowe dla firm, zawierające:
1. Analizę SWOT (Strengths, Weaknesses, Opportunities, Threats)
2. Analizę konkurencji
3. Strategię pozycjonowania
4. Plan działań marketingowych
5. Alokację budżetu
6. Timeline z kamieniami milowymi
7. KPI i metryki sukcesu

Odpowiadaj po polsku w formacie strukturalnym, używając nagłówków i list punktowanych.`;

    const userPrompt = `Stwórz kompleksową strategię marketingową dla:
    
Firma: ${companyName}
Branża: ${industry}
Produkt/Usługa: ${productService}
Grupa docelowa: ${targetAudience}
Cele: ${goals}
Budżet: ${budget}
Timeline: ${timeline}

Przygotuj szczegółową strategię zawierającą wszystkie kluczowe elementy.`;

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
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
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
          JSON.stringify({ error: "Wymagane doładowanie konta Lovable AI." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI Gateway error");
    }

    const data = await response.json();
    const strategy = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ strategy }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-strategy:", error);
    const errorMessage = error instanceof Error ? error.message : "Wystąpił błąd podczas generowania strategii";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
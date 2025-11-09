import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { transcript } = await req.json();
    
    if (!transcript) {
      throw new Error('No transcript provided');
    }

    console.log('Generating pitch from transcript...');

    const systemPrompt = `You are an expert pitch consultant specialized in Guy Kawasaki's pitch deck formula. 
Your task is to analyze a startup idea transcript and create:
1. A compelling one-liner (max 20 words) that captures the essence of the startup
2. A structured pitch deck outline following Guy Kawasaki's 10-slide formula:
   - Title/Company Purpose
   - Problem
   - Solution
   - Business Model
   - Magic/Technology
   - Marketing & Sales
   - Competition
   - Team
   - Financial Projections & Key Metrics
   - Current Status, Timeline & Use of Funds

Format your response EXACTLY as JSON with this structure:
{
  "oneLiner": "Your compelling one-liner here",
  "deckStructure": "Detailed pitch deck structure with all 10 sections filled out based on the transcript"
}`;

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Here's the startup idea transcript: ${transcript}` }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI generation error:', errorText);
      throw new Error(`Pitch generation failed: ${errorText}`);
    }

    const result = await response.json();
    let content = result.choices[0].message.content;
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedContent = JSON.parse(content);
    
    console.log('Pitch generation successful');

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-pitch:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

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
2. A detailed pitch deck outline following Guy Kawasaki's 10-slide formula

For the deck structure, provide comprehensive content for each of these 10 sections:

1. Title/Company Purpose - Company name and tagline
2. Problem - What pain point are you solving? Include statistics if possible
3. Solution - Your product/service and how it solves the problem
4. Business Model - How you make money, pricing strategy
5. Magic/Technology - Your unique competitive advantage or secret sauce
6. Marketing & Sales - Go-to-market strategy and customer acquisition
7. Competition - Competitive landscape and your differentiation
8. Team - Key team members and their relevant experience
9. Financial Projections & Key Metrics - Revenue projections, key metrics, unit economics
10. Current Status, Timeline & Use of Funds - Current traction, milestones, and funding ask

Format your response as JSON with this EXACT structure:
{
  "oneLiner": "Your compelling one-liner here (max 20 words)",
  "deckStructure": "# 1. Title/Company Purpose\n[Company name and tagline]\n\n# 2. Problem\n[Problem description]\n\n# 3. Solution\n[Solution details]\n\n# 4. Business Model\n[Business model]\n\n# 5. Magic/Technology\n[Unique advantages]\n\n# 6. Marketing & Sales\n[Go-to-market strategy]\n\n# 7. Competition\n[Competitive analysis]\n\n# 8. Team\n[Team information]\n\n# 9. Financial Projections\n[Financial details]\n\n# 10. Current Status\n[Status and funding ask]"
}

Make each section substantial with 3-5 sentences of detailed, actionable content based on the transcript.`;

    console.log('Transcript:', transcript.substring(0, 100) + '...');

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
    
    console.log('Raw AI response:', content.substring(0, 200) + '...');
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedContent = JSON.parse(content);
    
    console.log('Parsed successfully. One-liner length:', parsedContent.oneLiner?.length);
    console.log('Deck structure length:', parsedContent.deckStructure?.length);

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

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
    const { skills, education, experience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating career recommendations for skills:', skills);

    const prompt = `You are a career counselor analyzing a student's profile. Based on the following information, provide career recommendations.

Skills: ${skills?.join(', ') || 'None listed'}
Education: ${education?.map((edu: any) => `${edu.degree} in ${edu.field} from ${edu.institution}`).join(', ') || 'None'}
Experience: ${experience?.map((exp: any) => `${exp.position} at ${exp.company}`).join(', ') || 'None'}

Provide a JSON response with:
1. careerPaths (array of 3-5 objects):
   - title: Career path name
   - description: Brief description (max 100 chars)
   - matchScore: 0-100 score based on skill match
   - skills: Array of 5 key skills needed
   - roles: Array of 3 common job roles
   - growthRate: "Faster than average" or "Much faster than average"

2. recommendedJobs (array of 3-5 objects):
   - title: Job title matching their skills
   - company: Realistic company name
   - location: Location (mix of Remote and cities)
   - matchScore: 0-100 based on skill match
   - postedDate: Recent date in YYYY-MM-DD format

Base recommendations on actual skills provided. Higher match scores for careers/jobs that directly use their listed skills.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a career counselor. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let recommendationsText = data.choices[0].message.content;
    
    console.log('Recommendations received:', recommendationsText);

    let recommendations;
    try {
      // Remove markdown code block wrapper if present
      if (recommendationsText.includes('```json')) {
        recommendationsText = recommendationsText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (recommendationsText.includes('```')) {
        recommendationsText = recommendationsText.replace(/```\n?/g, '');
      }
      
      recommendations = JSON.parse(recommendationsText.trim());
      console.log('Successfully parsed recommendations:', recommendations);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      console.error('Raw response:', recommendationsText);
      
      // Fallback response
      recommendations = {
        careerPaths: [
          {
            title: "Technology Career",
            description: "Build a career in the technology sector based on your skills.",
            matchScore: 75,
            skills: skills?.slice(0, 5) || ["Problem Solving", "Communication", "Teamwork"],
            roles: ["Junior Developer", "Analyst", "Coordinator"],
            growthRate: "Faster than average"
          }
        ],
        recommendedJobs: [
          {
            title: "Entry Level Position",
            company: "Tech Company",
            location: "Remote",
            matchScore: 70,
            postedDate: new Date().toISOString().split('T')[0]
          }
        ]
      };
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-career-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

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
    const { resumeData, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing resume for job match...');

    const prompt = `You are a professional resume analyst. Analyze the following resume against the job description and provide detailed feedback. Accept both UK and US English spellings (e.g., "organise/organize", "colour/color", "centre/center") as equally valid.

Resume:
Name: ${resumeData.personalInfo?.name || 'N/A'}
Email: ${resumeData.personalInfo?.email || 'N/A'}
Phone: ${resumeData.personalInfo?.phone || 'N/A'}

Education:
${resumeData.education?.map((edu: any) => `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`).join('\n') || 'None'}

Work Experience:
${resumeData.experience?.map((exp: any) => `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n  ${exp.description}`).join('\n\n') || 'None'}

Skills:
${resumeData.skills?.join(', ') || 'None'}

Projects:
${resumeData.projects?.map((proj: any) => `- ${proj.name}: ${proj.description}`).join('\n') || 'None'}

Job Description:
${jobDescription || 'General assessment'}

Provide a JSON response with:
1. score (0-100): Overall resume quality
2. matchScore (0-100): How well it matches the job
3. strengths (array): 3-5 key strengths
4. improvements (array): 3-5 areas to improve
5. keywordMatches (array): Keywords found in resume
6. missingKeywords (array): Important keywords missing`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a professional resume analyst. Always respond with valid JSON only.' },
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
    let analysisText = data.choices[0].message.content;
    
    console.log('Analysis received:', analysisText);

    // Parse the JSON response - handle markdown code blocks
    let analysis;
    try {
      // Remove markdown code block wrapper if present
      if (analysisText.includes('```json')) {
        analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (analysisText.includes('```')) {
        analysisText = analysisText.replace(/```\n?/g, '');
      }
      
      analysis = JSON.parse(analysisText.trim());
      console.log('Successfully parsed analysis:', analysis);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      console.error('Raw response:', analysisText);
      // Fallback response if AI doesn't return valid JSON
      analysis = {
        score: 75,
        matchScore: 70,
        strengths: ['Resume submitted successfully', 'Information is well structured'],
        improvements: ['Add more specific achievements', 'Include quantifiable results'],
        keywordMatches: [],
        missingKeywords: []
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-resume function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

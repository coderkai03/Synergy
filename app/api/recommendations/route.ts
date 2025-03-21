import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { testLog } from '@/hooks/useCollection';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { User } from '@/types/User';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

const RecommendationsArraySchema = z.object({
  teamIds: z.array(z.string()),
  reason: z.string()
});

interface TeamBody {
  id: string;
  teammates: User[];
}

interface RecommendationsRequest {
  userData: User;
  teams: TeamBody[];
  hackathonId: string;
  input: string;
}

// POST: Generate team recommendations using GPT-4
export async function POST(request: Request) {
  try {
    // Parse and validate request data
    const body = await request.json();
    testLog('RECOMMENDATIONS_BODY', body);
    const {
      userData,
      teams,
      hackathonId,
      input
    } = body as RecommendationsRequest;
    testLog('RECOMMENDATIONS_INPUT', { userData, teams, hackathonId, input });

    // Construct GPT prompt with detailed team information
    const prompt = `
      I have a user with the following profile:
      - Technologies: ${userData.technologies.join(', ')}
      - Experience in: ${userData.category_experience.join(', ')}
      - Role experience: ${JSON.stringify(userData.role_experience)}
      - Number of hackathons: ${userData.number_of_hackathons}

      Here are the available teams:
      ${teams.map(team => `
        Team ID: "${team.id}":
        - Members: ${team.teammates.length}/4
        - Team Technologies: ${team.teammates.flatMap(member => member.technologies).join(', ')}
        - Team Experience: ${team.teammates.flatMap(member => member.category_experience).join(', ')}
      `).join('\n')}

      Please recommend up to 3 teams that would best match the user's request: ${input}.
      Try to complement the user's skills and experience. Exclude miscellaneous attributes like IDs from input or output.
      Return the team IDs and a reason for the recommendations.
      The reason should be a short sentence in 2nd POV that explains why the teams are good matches for the user.
    `;
    testLog('RECOMMENDATIONS_PROMPT', prompt);

    // Get GPT recommendations
    const completion = await openai.beta.chat.completions.parse({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      response_format: zodResponseFormat(RecommendationsArraySchema, "recommendations"),
      temperature: 0.5,
      max_tokens: 1000,
    });
    testLog('RECOMMENDATIONS_COMPLETION', completion);

    // Parse GPT response
    const recommendations = JSON.parse(completion.choices[0].message.content || '{}');
    testLog('RECOMMENDATIONS_PARSED', recommendations);

    // Return recommendations directly
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error:', error);
    //testLog('RECOMMENDATIONS_ERROR', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get recommendations' }, 
      { status: 500 }
    );
  }
} 
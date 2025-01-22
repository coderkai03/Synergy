import { NextResponse } from 'next/server';
import { useUser } from '@clerk/nextjs';
import { db } from '@/lib/firebase-admin';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { user } = useUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userData, teams, hackathonId } = await request.json();

    // Construct prompt for GPT
    const prompt = `
      I have a user with the following profile:
      - Technologies: ${userData.technologies.join(', ')}
      - Experience in: ${userData.category_experience.join(', ')}
      - Role experience: ${JSON.stringify(userData.role_experience)}
      - Number of hackathons: ${userData.number_of_hackathons}

      Here are the available teams:
      ${teams.map((team: any) => `
        Team "${team.name}":
        - Members: ${team.teammates.length}/4
        - Host ID: ${team.hostId}
      `).join('\n')}

      Please recommend 3 teams that would best complement this user's skills and experience.
      Consider team size, skill diversity, and experience levels.
      Format your response as a JSON array with team IDs and reasoning.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const recommendations = JSON.parse(completion.choices[0].message.content || '{}');

    // Fetch full team details for recommended teams
    const recommendedTeams = await Promise.all(
      recommendations.teams.map(async (rec: any) => {
        const teamDoc = await db.collection('teams').doc(rec.teamId).get();
        return {
          ...teamDoc.data(),
          id: teamDoc.id,
          reasoning: rec.reasoning
        };
      })
    );

    return NextResponse.json({ recommendations: recommendedTeams });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { doc, getDoc } from '@firebase/firestore';
import { collectionRouter, testRouteLog } from '@/app/api/collectionRouter';

// GET: Fetch team data by teamId
export async function POST(request: Request) {
  try {
    const { teamIds } = await request.json();
    const teams = await Promise.all(teamIds.map(async (teamId: string) => {
        const team = doc(collectionRouter('teams'), teamId);
        const teamData = await getDoc(team);
        return teamData.data();
    }));
    testRouteLog("some teams:", teams)

    if (!teams) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

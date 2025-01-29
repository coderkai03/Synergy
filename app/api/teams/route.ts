import { NextResponse } from 'next/server';
import { doc, getDoc, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useCollection } from '@/hooks/useCollection';

// GET: Fetch all teams for a specific user
export async function GET(request: Request) {
  // Extract userId from query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  // Validate userId exists
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Get user document to access their teams
    const userRef = doc(useCollection('users'), userId);
    const userDoc = await getDoc(userRef);
    const teamsData = userDoc.exists() ? userDoc.data()?.teams || [] : [];
    
    // Fetch full team data for each team ID
    const teams = await Promise.all(teamsData.map(async (teamId: string) => {
      const teamRef = doc(useCollection('teams'), teamId);
      const teamDoc = await getDoc(teamRef);
      return teamDoc.exists() ? { ...teamDoc.data(), id: teamId } : null;
    }));

    // Return filtered teams (removing any null values)
    return NextResponse.json({ teams: teams.filter(Boolean) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}

// POST: Create a new team and add it to user's teams
export async function POST(request: Request) {
  try {
    // Extract team data and userId from request body
    const { team, userId } = await request.json();
    
    // Create new team document
    const teamRef = useCollection('teams');
    const docRef = await addDoc(teamRef, team);
    
    // Update team with its own ID
    await updateDoc(docRef, { id: docRef.id });
    
    // Add team to user's teams array
    const userRef = doc(useCollection('users'), userId);
    await updateDoc(userRef, {
      teams: arrayUnion(docRef.id)
    });

    return NextResponse.json({ teamId: docRef.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
  }
} 
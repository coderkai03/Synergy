import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { testLog, useCollection } from '@/hooks/useCollection';

// GET: Fetch all teams for a specific hackathon
export async function GET(
  request: Request,
  { params }: { params: { hackathonId: string } }
) {
  try {
    // Query teams collection for specific hackathon
    const teamsRef = useCollection('teams');
    const q = query(teamsRef, where('hackathonId', '==', params.hackathonId));
    const snapshot = await getDocs(q);
    
    // Map documents to team objects with IDs
    const teams = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams for hackathon' }, 
      { status: 500 }
    );
  }
} 
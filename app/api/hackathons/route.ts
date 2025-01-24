import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useCollection } from '@/hooks/useCollection';

// GET: Fetch hackathons with optional limit
export async function GET(request: Request) {
  // Extract limit from query parameters (default: 10)
  const { searchParams } = new URL(request.url);
  const limitCount = Number(searchParams.get('limit')) || 10;

  try {
    // Query hackathons collection with ordering and limit
    const hackathonsRef = useCollection('hackathons');
    const q = query(hackathonsRef, orderBy('date', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    // Map documents to hackathon objects with IDs
    const hackathons = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    return NextResponse.json({ hackathons });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hackathons' }, { status: 500 });
  }
} 
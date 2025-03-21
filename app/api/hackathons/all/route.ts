import { NextResponse } from 'next/server';
import { collectionRouter } from '@/app/api/collectionRouter';
import { getDocs } from 'firebase/firestore';

// GET: Fetch all hackathons
export async function GET() {
  try {
    // Get all hackathons from collection
    const hackathonsRef = collectionRouter('hackathons');
    const snapshot = await getDocs(hackathonsRef);
    
    // Map documents to hackathon objects with IDs
    const hackathons = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    return NextResponse.json({ hackathons });
  } catch (error) {
    console.error('Error fetching all hackathons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hackathons' }, 
      { status: 500 }
    );
  }
} 
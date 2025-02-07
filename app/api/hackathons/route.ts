import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { testLog, useCollection } from '@/hooks/useCollection';

// GET: Fetch hackathon by ID
export async function POST(request: Request) {
  // Extract ID from request body
  const body = await request.json();
  const { id } = body;
  testLog('Requested hackathon ID:', id);

  if (!id) {
    testLog('No hackathon ID provided');
    return NextResponse.json(
      { error: 'Hackathon ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get single hackathon document by ID
    const hackathonRef = doc(useCollection('hackathons'), id);
    testLog('Getting hackathon ref:', hackathonRef.path);
    const snapshot = await getDoc(hackathonRef);

    if (!snapshot.exists()) {
      testLog('Hackathon not found:', id);
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    const hackathon = {
      ...snapshot.data(),
      id: snapshot.id,
    };
    testLog('Found hackathon:', hackathon);

    return NextResponse.json({ hackathon });
  } catch (error) {
    testLog('Error fetching hackathon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hackathon' },
      { status: 500 }
    );
  }
}
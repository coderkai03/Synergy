import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { collectionRouter, testRouteLog } from '@/app/api/collectionRouter';

// GET: Fetch hackathon by ID
export async function POST(request: Request) {
  // Extract ID from request body
  const body = await request.json();
  const { id } = body;
  testRouteLog('Requested hackathon ID:', id);

  if (!id) {
    testRouteLog('No hackathon ID provided');
    return NextResponse.json(
      { error: 'Hackathon ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get single hackathon document by ID
    const hackathonRef = doc(collectionRouter('hackathons'), id);
    testRouteLog('Getting hackathon ref:', hackathonRef.path);
    const snapshot = await getDoc(hackathonRef);

    if (!snapshot.exists()) {
      testRouteLog('Hackathon not found:', id);
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    const hackathon = {
      ...snapshot.data(),
      id: snapshot.id,
    };
    testRouteLog('Found hackathon:', hackathon);

    return NextResponse.json({ hackathon });
  } catch (error) {
    testRouteLog('Error fetching hackathon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hackathon' },
      { status: 500 }
    );
  }
}
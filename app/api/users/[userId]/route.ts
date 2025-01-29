import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { testLog } from '@/hooks/useCollection';
import { collectionRouter } from '@/app/api/collectionRouter';

// GET: Fetch user data by ID
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
    testLog("fetching user data for: ", params.userId);
  try {
    // Get user document
    const userRef = doc(collectionRouter('users'), params.userId);
    const userDoc = await getDoc(userRef);

    // testLog('userDoc:', userDoc);
    
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Return user data with ID
    const userData = {
      ...userDoc.data(),
      id: params.userId
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' }, 
      { status: 500 }
    );
  }
} 
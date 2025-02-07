import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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

// PUT: Update user data by ID
export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { ai_match_uses } = await request.json();
    const userRef = doc(collectionRouter('users'), params.userId);
    await updateDoc(userRef, { ai_match_uses });
    return NextResponse.json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
  }
}

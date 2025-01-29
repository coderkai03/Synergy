import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { collectionRouter } from '@/app/api/collectionRouter';

// GET: Fetch user data by ID
export async function GET(request: Request) {
  // Extract userId from query parameters
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Validate userId exists
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Get user document
    const userRef = doc(collectionRouter('users'), userId);
    const userDoc = await getDoc(userRef);
    
    // Check if user exists
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data with ID
    return NextResponse.json({ user: { ...userDoc.data(), id: userId } });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

// POST: Create or update user data
export async function POST(request: Request) {
  try {
    // Extract user data from request body
    const { user } = await request.json();
    
    // Create/update user document
    const userRef = doc(collectionRouter('users'), user.id);
    await setDoc(userRef, user);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
} 
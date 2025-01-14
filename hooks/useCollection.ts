import { addDoc, collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { db, storage } from '@/firebaseConfig';
import { toast } from 'react-hot-toast';
import { ref, getDownloadURL } from 'firebase/storage';

export function useCollection(collectionName: string): CollectionReference<DocumentData> {
    // Check if we're in test environment
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const isTest = publishableKey?.includes('pk_test');
  
  // Map collection names to their test equivalents
  const collectionMap: Record<string, string> = {
    'users': 'testUsers',
    'teams': 'testTeams',
    'posts': 'testPosts',
    'hackathons': 'hackathons', // static collection name; no test equivalent
    // Add more collections as needed
  };

  // Get the appropriate collection name based on environment
  const actualCollectionName = isTest ? collectionMap[collectionName] || collectionName : collectionName;
  
  return collection(db, actualCollectionName) as CollectionReference<DocumentData>;
}

export async function uploadFeedback(message: string, userId?: string) {
  try {
    const feedbackCollection = collection(db, 'feedback');
    const timestamp = new Date();
    
    await addDoc(feedbackCollection, {
      message,
      timestamp,
      userId: userId || null
    });

    toast.success('Thanks for the feedback!');
    testLog('Feedback uploaded successfully');
    return true;
  } catch (error) {
    testLog('Error uploading feedback:', error);
    return false;
  }
}

export function testLog(...args: any[]) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isTest = publishableKey?.includes('pk_test');

  if (isTest) {
    console.log(...args);
  }
}

export async function fetchFile(filePath: string) {
  const fileRef = ref(storage, filePath);
  const downloadURL = await getDownloadURL(fileRef);
  console.log("File URL:", downloadURL);
  return downloadURL;
}

// Usage example:
// const usersCollection = useCollection<User>('users');
// const teamsCollection = useCollection<Team>('teams'); 
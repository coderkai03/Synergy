import { collection, CollectionReference, DocumentData } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

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

// Usage example:
// const usersCollection = useCollection<User>('users');
// const teamsCollection = useCollection<Team>('teams'); 
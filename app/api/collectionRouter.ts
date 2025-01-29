import { db } from "@/firebaseConfig";
import { collection, CollectionReference, DocumentData } from "firebase/firestore";

export function collectionRouter(collectionName: string): CollectionReference<DocumentData> {
    // Check if we're in test environment
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const isTest = publishableKey?.includes('pk_test');
  
  // Map collection names to their test equivalents
  const collectionMap: Record<string, string> = {
    'users': 'testUsers',
    'teams': 'testTeams',
    'posts': 'testPosts',
    'hackathons': 'hackathons', // static collection name; no test equivalent
    'matchRequests': 'testMatchRequests',
    // Add more collections as needed
  };

  // Get the appropriate collection name based on environment
  const actualCollectionName = isTest ? collectionMap[collectionName] || collectionName : collectionName;
  
  return collection(db, actualCollectionName) as CollectionReference<DocumentData>;
}

export function testRouteLog(...args: any[]) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const isTest = publishableKey?.includes('pk_test');
  
    if (isTest) {
      console.log(...args);
    }
  }
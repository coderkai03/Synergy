import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useCollection } from './useCollection';

type DocSubscriptionProps<T> = {
  collectionName: string;
  docId: string;
  onUpdate: (data: T) => void;
  enabled?: boolean;
}
// Utility function to subscribe to a document without hooks
export function subscribeToDoc<T>({ 
  collectionName, 
  docId, 
  onUpdate,
  enabled = true 
}: DocSubscriptionProps<T>) {
  if (!docId || !enabled) return () => {};

  const docIds = docId.split(',').filter(Boolean);
  if (docIds.length === 0) return () => {};

  console.log(`Subscribing to ${collectionName} docs:`, docIds);
  
  const unsubscribes = docIds.map(id => {
    const docRef = doc(useCollection(collectionName), id);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as T;
        console.log(`New ${collectionName} data:`, data);
        onUpdate(data);
      }
    }, (error) => {
      console.error(`Error in ${collectionName} subscription:`, error);
    });
  });

  // Return function that unsubscribes from all docs
  return () => unsubscribes.forEach(unsubscribe => unsubscribe());
}

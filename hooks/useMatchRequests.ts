import toast from 'react-hot-toast';
import { useCollection, testLog } from './useCollection';
import { addDoc, where, query, getDocs } from 'firebase/firestore';

export function useMatchRequests() {
  const matchRequestsCollection = useCollection('matchRequests');

  const createMatchRequest = async (userId: string, hackathonId: string) => {
    try {
      const matchRequest = {
        userId,
        hackathonId,
        timestamp: new Date(),
      };

      const docRef = await addDoc(matchRequestsCollection, matchRequest);
      testLog('Match request created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      testLog('Error creating match request:', error);
      throw error;
    }
  };

  const checkIfPendingRequest = async (userId: string, hackathonId: string) => {
    try {
      const querySnapshot = await getDocs(query(
        matchRequestsCollection,
        where('userId', '==', userId),
        where('hackathonId', '==', hackathonId)
      ));

      if (!querySnapshot.empty) {
        const now = new Date();
        const nextEightAM = new Date();
        nextEightAM.setHours(8, 0, 0, 0);
        if (nextEightAM < now) {
          nextEightAM.setDate(nextEightAM.getDate() + 1);
        }
        
        const hoursRemaining = Math.ceil((nextEightAM.getTime() - now.getTime()) / (1000 * 60 * 60));
        return hoursRemaining;
      }
      return 0;
    } catch (error) {
      testLog('Error checking pending request:', error);
      throw error;
    }
  };

  return {
    createMatchRequest,
    checkIfPendingRequest
  };
}

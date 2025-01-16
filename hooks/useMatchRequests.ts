import toast from 'react-hot-toast';
import { useCollection, testLog } from './useCollection';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export function useMatchRequests() {
  const matchRequestsCollection = useCollection('matchRequests');

  const createMatchRequest = async (userId: string, hackathonId: string) => {
    try {
      const matchRequest = {
        users: {
          [userId]: {
            status: 'pending',
            timestamp: new Date()
          }
        }
      };

      await setDoc(doc(matchRequestsCollection, hackathonId), matchRequest, { merge: true });
      testLog('Match request created for hackathon:', hackathonId);
      return hackathonId;
    } catch (error) {
      testLog('Error creating match request:', error);
      throw error;
    }
  };

  const checkIfPendingRequest = async (userId: string, hackathonId: string) => {
    try {
      const docRef = doc(matchRequestsCollection, hackathonId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().users?.[userId]?.status === 'pending') {
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

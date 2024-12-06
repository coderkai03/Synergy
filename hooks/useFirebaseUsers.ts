"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { User } from '@/interfaces/User';

export function useFirebaseUser(clerkUserId?: string): {
  userData: User | null, 
  loading: boolean, 
  error: string | null 
} {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkUserId) {
        setLoading(false);
        return;
      }

      try {
        const usersRef = doc(db, "users", clerkUserId);
        const querySnapshot = await getDoc(usersRef);

        if (!querySnapshot.exists()) {
          setUserData(null);
        } else {
          setUserData({
            ...querySnapshot.data(),
            firstName: querySnapshot.data().full_name.split(' ')[0],
            lastName: querySnapshot.data().full_name.split(' ')[1],
          } as User);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred fetching user data');
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [clerkUserId]);

  return { userData, loading, error };
}

export function useUserHackathons(clerkUserId?: string): {
  hackathonIds: string[], 
  loading: boolean, 
  error: string | null 
} {
  const [hackathonIds, setHackathonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the existing useFirebaseUser hook to get user data
  const { userData, loading: userLoading, error: userError } = useFirebaseUser(clerkUserId);

  useEffect(() => {
    const fetchHackathonIds = async () => {
      if (userLoading) return;
      
      if (userError) {
        setError(userError);
        setLoading(false);
        return;
      }

      if (!userData) {
        setLoading(false);
        return;
      }

      try {
        const teams = userData.teams || [];
        const activeHackathons: string[] = [];

        // Check each team document for its associated hackathon
        for (const teamId of teams) {
          const teamDoc = await getDoc(doc(db, 'teams', teamId));
          if (teamDoc.exists()) {
            const teamData = teamDoc.data();
            if (teamData.hackathonId) {
              activeHackathons.push(teamData.hackathonId);
            }
          }
        }

        setHackathonIds(activeHackathons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred fetching hackathon data');
        console.error("Error fetching hackathon data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathonIds();
  }, [userData, userLoading, userError]);

  return { hackathonIds, loading: loading || userLoading, error: error || userError };
}

export function useUserExists(clerkUserId: string | undefined): {
  exists: boolean
} {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const checkUserExists = async () => {
      if (!clerkUserId) {
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', clerkUserId));
      setExists(userDoc.exists());
    };

    checkUserExists();
  }, [clerkUserId]);

  return { exists };
}

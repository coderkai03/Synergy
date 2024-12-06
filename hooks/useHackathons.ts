"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { Hackathon } from '@/constants/hackathonlist';

export function useHackathons() {
  const [hackathonsList, setHackathonsList] = useState<Hackathon[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hackathonsRef = collection(db, "hackathons");
        const hackathonsSnap = await getDocs(hackathonsRef);
        const hackathonsData = hackathonsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHackathonsList(hackathonsData as Hackathon[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return { hackathonsList };
}

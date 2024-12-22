"use client";

import { useState, useEffect } from 'react';
import { collection, getDoc, doc, getDocs } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { Hackathon } from '@/types/Hackathons';

export function useHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const hackathonsRef = collection(db, "hackathons");
        const hackathonsSnap = await getDocs(hackathonsRef);
        const hackathonsData = hackathonsSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setHackathons(hackathonsData as Hackathon[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchHackathons()
  }, [])

  const getHackathons = async (ids: string[]) => {
    const hackathons = await Promise.all(ids.map(async (id) => {
      try {
        const hackathonRef = doc(db, 'hackathons', id);
        const hackathon = await getDoc(hackathonRef);
        return {...hackathon.data(), id} as Hackathon;
      } catch (err) {
        console.error("Error fetching hackathon:", err);
        return null;
      }
    }));

    return hackathons as Hackathon[];
  }

  const getAllHackathons = async () => {
    const hackathons = await getDocs(collection(db, "hackathons"));
    return hackathons.docs.map((doc) => doc.data() as Hackathon);
  }

  return { hackathons, getHackathons, getAllHackathons };
}

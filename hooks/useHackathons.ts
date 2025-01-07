"use client";

import { useState, useEffect } from 'react';
import { collection, getDoc, doc, getDocs } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { Hackathon } from '@/types/Hackathons';
import { useCollection } from './useCollection';

export function useHackathons() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchHackathons = async () => {
      try {
        const hackathonsRef = useCollection("hackathons");
        const hackathonsSnap = await getDocs(hackathonsRef);
        const hackathonsData = hackathonsSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setHackathons(hackathonsData as Hackathon[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchHackathons()
  }, [])

  const getHackathons = async (ids: string[]) => {
    setLoading(true);
    const hackathons = await Promise.all(ids.map(async (id) => {
      try {
        const hackathonRef = doc(useCollection('hackathons'), id);
        const hackathon = await getDoc(hackathonRef);
        return {...hackathon.data(), id} as Hackathon;
      } catch (err) {
        console.error("Error fetching hackathon:", err);
        return null;
      }
    }));

    setLoading(false);
    return hackathons as Hackathon[];
  }

  return { hackathons, getHackathons, loading };
}


"use client";

import { useState, useEffect } from 'react';
import { collection, getDoc, doc, getDocs, startAfter, orderBy, query, limit } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { Hackathon } from '@/types/Hackathons';
import { useCollection } from './useCollection';

export function useHackathons() {
  const [loading, setLoading] = useState(false);

  const getOlderHackathons = async (limitCount: number, lastHackathonId?: string) => {
    setLoading(true);
    try {
      const hackathonsRef = useCollection('hackathons');
      let q;
      
      if (lastHackathonId) {
        const lastHackathonDoc = await getDoc(doc(hackathonsRef, lastHackathonId));
        console.log(`Last doc after ${lastHackathonId}: `, lastHackathonDoc);
        q = query(hackathonsRef, 
          orderBy('date', 'desc'),
          startAfter(lastHackathonDoc), 
          limit(limitCount)
        );
      } else {
        console.log("Last doc [no id]: ");
        q = query(hackathonsRef, 
          orderBy('date', 'desc'),
          limit(limitCount)
        );
      }

      const hackathonsSnap = await getDocs(q);
      const hackathons = hackathonsSnap.docs
        .map((doc) => ({ ...doc.data(), id: doc.id } as Hackathon));
      console.log("Fetched: ", hackathons.map(h => h.id));

      // Return false if we got fewer docs than requested
      const hasMore = hackathons.length >= limitCount;

      return { hackathons, hasMore };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

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

  const getAllHackathons = async () => {
    setLoading(true);
    const hackathons = await getDocs(useCollection('hackathons'));
    setLoading(false);
    return hackathons.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Hackathon));
  }

  return {
    getOlderHackathons,
    getHackathons,
    getAllHackathons,
    loading
  };
}


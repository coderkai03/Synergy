"use client";

import { useState } from 'react';
import { getDoc, doc, getDocs, startAfter, orderBy, query, limit, where } from '@firebase/firestore';
import { Hackathon } from '@/types/Hackathons';
import { useCollection, testLog } from './useCollection';

export function useHackathons() {
  const [loading, setLoading] = useState(false);

  const getOlderHackathons = async (limitCount: number, lastHackathonId?: string) => {
    setLoading(true);
    try {
      const hackathonsRef = useCollection('hackathons');
      let q;
      
      if (lastHackathonId) {
        const lastHackathonDoc = await getDoc(doc(hackathonsRef, lastHackathonId));
        testLog(`Last doc after ${lastHackathonId}: `, lastHackathonDoc);
        q = query(hackathonsRef, 
          orderBy('date', 'desc'),
          startAfter(lastHackathonDoc), 
          limit(limitCount)
        );
      } else {
        testLog("Last doc [no id]: ");
        q = query(hackathonsRef, 
          orderBy('date', 'desc'),
          limit(limitCount)
        );
      }

      const hackathonsSnap = await getDocs(q);
      const hackathons = await Promise.all(hackathonsSnap.docs
        .map(async (doc) => {
          return { ...doc.data(), id: doc.id } as Hackathon;
        }));
      testLog("Fetched: ", hackathons.map(h => h.id));

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
    const hackathonsWithImages = await Promise.all(hackathons.docs.map(async (doc) => {
      return {
        ...doc.data(),
        id: doc.id,
      } as Hackathon;
    }));
    return hackathonsWithImages;
  }

  const getUpcomingHackathons = async (limitCount: number) => {
    try {
      const allHackathons = await getAllHackathons();
            
      const upcomingHackathons = allHackathons
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, limitCount);

      testLog("upcoming hackathons: ", upcomingHackathons.map(h => h.id));

      if (upcomingHackathons.length === 0) {
        testLog("No upcoming hackathons found");
        return [];
      }

      return upcomingHackathons;
    } catch (error) {
      console.error("Error fetching upcoming hackathons:", error);
      throw error;
    }
  }

  return {
    getOlderHackathons,
    getHackathons,
    getAllHackathons,
    getUpcomingHackathons,
    loading
  };
}


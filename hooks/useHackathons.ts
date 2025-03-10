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
    try {
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

      return hackathons as Hackathon[];
    } finally {
      setLoading(false);
    }
  }

  const getAllHackathons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hackathons/all');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data.hackathons;
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const getUpcomingHackathons = async (limitCount: number) => {
    setLoading(true);
    try {
      const hackathonsRef = useCollection('hackathons');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get end date (end of current day)
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const q = query(hackathonsRef,
        where('endDate', '>=', today.toISOString()),
        orderBy('endDate'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const upcomingHackathons = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Hackathon[];

      testLog("upcoming and ongoing hackathons: ", upcomingHackathons.map(h => h.id));

      if (upcomingHackathons.length === 0) {
        testLog("No upcoming or ongoing hackathons found");
        return [];
      }

      return upcomingHackathons;
    } catch (error) {
      console.error("Error fetching upcoming hackathons:", error);
      throw error;
    } finally {
      setLoading(false);
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


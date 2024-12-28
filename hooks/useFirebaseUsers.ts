"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { User } from '@/types/User';
import { Invite, Team } from '@/types/Teams';
import { useUser } from '@clerk/nextjs';

export function useFirebaseUser() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      const data = await getUsers([user.id]);
      setUserData(data[0] as User);
      setLoading(false);
    }

    fetchUserData();
  }, [user?.id]);

  // Move updateUserInvites outside useEffect so it can be returned
  const updateUserInvites = async (index: number, invites: Invite[], accepted: boolean) => {
    if (!user?.id) return;

    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      invites: invites.filter((_, i) => i !== index),
      teams: accepted ? [...(userData?.teams || []), invites[index].teamId] : userData?.teams
    });
    console.log(`Updated user invites: ${accepted ? 'accepted' : 'declined'} invite to ${invites[index].teamId}`)
  }    

  const getUsers = async (userIds: string[]) => {
    const users = await Promise.all(userIds.map(async (userId) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return {
        ...userDoc.data(),
        id: userId
      } as User;
    }));
    return users;
  }

  return { loading, error, userData, updateUserInvites, getUsers };
}
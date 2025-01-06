"use client";

import { useState, useEffect } from 'react';
import { arrayUnion, doc, getDoc, getDocs, orderBy,startAfter,  query, setDoc, updateDoc, limit } from '@firebase/firestore';
import { User } from '@/types/User';
import { Invite } from '@/types/Teams';
import { useUser } from '@clerk/nextjs';
import { useCollection } from './useCollection';
import { toast } from 'react-hot-toast';

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
      console.log('userData:', data[0]);
    }

    fetchUserData();
  }, [user?.id]);

  const createUser = async (formData: User) => {
    try {
      console.log("Submitting formData:", formData);
      if (!user?.id) return;
      const userDoc = doc(useCollection('users'), user.id);
      await setDoc(userDoc, {
        ...formData, 
        email: user?.primaryEmailAddress?.emailAddress,
      });
      console.log("User data updated successfully");

      return true;
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      toast.error("Failed to save your profile. Please try again.");
      return false;
    }
  }

  // Move updateUserInvites outside useEffect so it can be returned
  const updateUserInvites = async (index: number, invites: Invite[], accepted: boolean) => {
    if (!user?.id) return;

    const userRef = doc(useCollection('users'), user.id);
    await updateDoc(userRef, {
      invites: invites.filter((_, i) => i !== index),
      teams: accepted 
        ? arrayUnion(invites[index].teamId) // Simply add new team to array
        : userData?.teams || [] // Keep existing teams array if not accepted
    });
    
    console.log(`Updated user invites: ${accepted ? 'accepted' : 'declined'} invite to ${invites[index].teamId}`);
  }    

  const getUsers = async (userIds: string[]) => {
    const users = await Promise.all(userIds.map(async (userId) => {
      const userRef = doc(useCollection('users'), userId);
      const userDoc = await getDoc(userRef);
      return {
        ...userDoc.data(),
        id: userId
      } as User;
    }));
    return users;
  }
  
  const getAllUsers = async () => {
    const userDocs = await getDocs(useCollection('users'));
    const users = userDocs.docs
      .map((doc) => ({ ...doc.data(), id: doc.id } as User))
      .filter((u) => u.id !== user?.id);
    return users;
  }

  const getOlderUsers = async (limitCount: number, lastUserId?: string) => {
    setLoading(true);
    try {
      const usersRef = useCollection('users');
      let q;
      
      if (lastUserId) {
        const lastUserDoc = await getDoc(doc(usersRef, lastUserId));
        q = query(usersRef, 
          orderBy('id'),
          startAfter(lastUserDoc), 
          limit(limitCount)
        );
      } else {
        q = query(usersRef, 
          orderBy('id'),
          limit(limitCount)
        );
      }

      const userDocs = await getDocs(q);
      console.log("older user docs:", userDocs);
      const users = userDocs.docs
        .map((doc) => ({ ...doc.data(), id: doc.id } as User))
        .filter((u) => u.id !== user?.id);

      console.log("older users:", users);

      // Return false if we got fewer docs than requested
      const hasMore = users.length >= limitCount;

      return { users, hasMore };
    } catch (error) {
      console.error('Error fetching older users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    userData,
    updateUserInvites,
    getUsers,
    createUser,
    getAllUsers,
    getOlderUsers
  };
}

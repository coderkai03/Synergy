"use client";

import { useState, useEffect } from 'react';
import { arrayUnion, doc, getDoc, getDocs, orderBy,startAfter,  query, setDoc, updateDoc, limit } from '@firebase/firestore';
import { User } from '@/types/User';
import { Invite } from '@/types/Teams';
import { useUser } from '@clerk/nextjs';
import { testLog, useCollection } from './useCollection';
import { toast } from 'react-hot-toast';

export function useFirebaseUser() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserData = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      testLog('userData:', data.user);
      return data.user as User;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (formData: User, userData: User) => {
    setLoading(true);
    try {
      testLog("Submitting formData:", formData);
      if (!userData?.id) return;
      const userDoc = doc(useCollection('users'), userData.id);
      await setDoc(userDoc, {
        ...formData, 
        email: userData.email,
      });
      testLog("User data updated successfully");

      return true;
    } catch (error) {
      testLog("Error saving to Firestore:", error);
      toast.error("Failed to save your profile. Please try again.");
      setError('Failed to save your profile. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Move updateUserInvites outside useEffect so it can be returned
  const updateUserInvites = async (index: number, invites: Invite[], accepted: boolean, userData: User) => {
    setLoading(true);
    if (!userData?.id) return;

    const userRef = doc(useCollection('users'), userData.id);
    await updateDoc(userRef, {
      invites: invites.filter((_, i) => i !== index),
      teams: accepted 
        ? arrayUnion(invites[index].teamId) // Simply add new team to array
        : userData?.teams || [] // Keep existing teams array if not accepted
    });
    
    testLog(`Updated user invites: ${accepted ? 'accepted' : 'declined'} invite to ${invites[index].teamId}`);
    setLoading(false);
  }    

  const getUsers = async (userIds: string[]) => {
    setLoading(true);
    try {
      const users = await Promise.all(userIds.map(async (userId) => {
        const userRef = doc(useCollection('users'), userId);
        const userDoc = await getDoc(userRef);
        return {
        ...userDoc.data(),
        id: userId
      } as User;
    }));
      setLoading(false);
      return users;
    } catch (error) {
      testLog('Error fetching users:', error);
      setError('Failed to fetch users');
      setLoading(false);
      return [];
    } finally {
      setLoading(false);
    }
  }

  const getOlderUsers = async (limitCount: number, lastUserId?: string, userData?: User) => {
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
      testLog("older user docs:", userDocs);
      const users = userDocs.docs
        .map((doc) => ({ ...doc.data(), id: doc.id } as User))
        .filter((u) => u.id !== userData?.id);

      testLog("older users:", users);

      // Return false if we got fewer docs than requested
      const hasMore = users.length >= limitCount;

      return { users, hasMore };
    } catch (error) {
      testLog('Error fetching older users:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    updateUserInvites,
    getUserData,
    getUsers,
    createUser,
    getOlderUsers
  };
}

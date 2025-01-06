import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, arrayRemove, deleteDoc, where, query, setDoc, addDoc, arrayUnion, runTransaction, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Invite, Team } from '@/types/Teams';
import { User } from '@/types/User';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useCollection } from './useCollection';

export function useTeams() {
  const { user } = useUser()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function fetchTeams() {
      console.log('fetching teams for user:', user?.id)

      if (!user?.id) return;
      console.log('user?.id', user?.id)

      try {
        const userRef = doc(useCollection('users'), user?.id);
        const userDoc = await getDoc(userRef);
        console.log('userDoc', userDoc.data())

        const teamsData: string[] = userDoc.exists() ? userDoc.data()?.teams || [] : [];
        const teams = await getTeams(teamsData);
        console.log('teamsData', teamsData)

        setUserTeams(teams);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
        setLoading(false);
      }
    }
    fetchTeams();
  }, [user?.id]);
  

  const updateTeamInvites = async (teammateIds: string[], userId: string, invite: Invite) => {
    try {
      // Update each team document
      await Promise.all(teammateIds.map(async (teammateId) => {
        const inviteeRef = doc(useCollection('users'), teammateId);
        const inviteeDoc = await getDoc(inviteeRef);
        
        if (inviteeDoc.exists()) {
          const currentInvites = inviteeDoc.data().invites || [];
          // Only add if not already invited
          if (!currentInvites.includes(userId)) {
            await updateDoc(inviteeRef, {
              invites: [...currentInvites, invite]
            });
          }
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating team invites:', error);
      return false;
    }
  };

  const updateTeamInvitesByEmail = async (teammateEmails: string[], userId: string, invite: Invite) => {
    try {
      // Get all users matching the emails
      const usersRef = useCollection('users');
      const emailQueries = teammateEmails.map(email => 
        query(usersRef, where('email', '==', email))
      );

      const userSnapshots = await Promise.all(
        emailQueries.map(q => getDocs(q))
      );

      // Flatten and get user IDs
      const userIds = userSnapshots
        .flatMap(snapshot => snapshot.docs)
        .map(doc => doc.id)
        .filter(id => id !== userId);

      if (userIds.length === 0) {
        throw new Error('No users found with the provided emails');
      }

      // Update invites for each found user
      await Promise.all(userIds.map(async (teammateId) => {
        const inviteeRef = doc(useCollection('users'), teammateId);
        const inviteeDoc = await getDoc(inviteeRef);
        
        if (inviteeDoc.exists()) {
          const currentInvites = inviteeDoc.data().invites || [];
          // Only add if not already invited
          if (!currentInvites.some((inv: Invite) => inv.teamId === invite.teamId)) {
            await updateDoc(inviteeRef, {
              invites: [...currentInvites, invite]
            });
          }
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating team invites:', error);
      throw error;
    }
  };

  const updateTeammates = async (teamId: string, teammateId: string) => {
    const teamRef = doc(useCollection('teams'), teamId);
    await updateDoc(teamRef, {
      teammates: arrayUnion(teammateId)
    });
  }

  const updateTeamHost = async (teamId: string, hostId: string) => {
    const teamRef = doc(useCollection('teams'), teamId);
    await updateDoc(teamRef, {
      hostId: hostId
    });
  }

  const getTeams = async (teamIds: string[]) => {
    console.log('teamIds', teamIds)
    
    try {
      console.log('Starting Promise.all')
      const teams = await Promise.all(teamIds.map(async (teamId) => {
        console.log('fetching teamId', teamId)
        const teamRef = doc(useCollection('teams'), teamId);
        const teamDoc = await getDoc(teamRef);
        console.log('teamDoc', teamDoc.data())

        if (!teamDoc.exists()) {
          console.log(`Team ${teamId} not found`);
          return null;
        }
        
        const data = teamDoc.data();
        console.log(`Team ${teamId} data:`, data);
        
        return {
          ...data,
          id: teamId
        } as Team;
      }));
      console.log('Promise.all completed', teams);
      return teams.filter(team => team !== null) as Team[];
    } catch (error) {
      console.error('Error in getTeams:', error);
      throw error;
    }
  }

  const getAllTeams = async () => {
    const teamDocs = await getDocs(useCollection('teams'));
    const teams = teamDocs.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    } as Team));
    return teams;
  }

  const createTeam = async (team: Team) => {
    if (userTeams.some(userTeam => userTeam.hackathonId === team.hackathonId)) {
      return 'alreadyInTeam';
    }

    const teamRef = useCollection('teams');
    const docRef = await addDoc(teamRef, team);

    // Add teamId to user's teams collection
    const userRef = doc(useCollection('users'), team.hostId);
    await updateDoc(userRef, {
      teams: arrayUnion(docRef.id)
    });

    return docRef.id;
  }

  const leaveTeam = async (teamId: string, userId: string) => {
    const teamRef = doc(useCollection('teams'), teamId);
    // remove userId from team
    await updateDoc(teamRef, {
      teammates: arrayRemove(userId)
    });

    // remove teamId from user's teams array
    const userRef = doc(useCollection('users'), userId);
    await updateDoc(userRef, {
      teams: arrayRemove(teamId)
    });
  }

  const deleteTeam = async (teamId: string, hostId: string) => {
    // delete team
    const teamRef = doc(useCollection('teams'), teamId);
    await deleteDoc(teamRef);

    // remove teamId from user
    const userRef = doc(useCollection('users'), hostId);
    await updateDoc(userRef, {
      teams: arrayRemove(teamId)
    });
  }

  const teamNameExists = async (teamName: string, hackathonId: string) => {
    try {
      const teamsRef = useCollection('teams');
      const q = query(teamsRef, 
        where('hackathonId', '==', hackathonId),
        where('name', '==', teamName)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking team name:', error);
      throw error;
    }
  }

  const updateRequests = async (teamId: string, userId: string, accepted: boolean) => {
    const teamRef = doc(useCollection('teams'), teamId);
    // remove userId from requests
    await updateDoc(teamRef, {
      requests: arrayRemove(userId)
    });

    if (accepted) {
      // add userId to teammates
      await updateDoc(teamRef, {
        teammates: arrayUnion(userId)
      });

      // add teamId to user's teams collection
      const userRef = doc(useCollection('users'), userId);
      await updateDoc(userRef, {
        teams: arrayUnion(teamId)
      });
    }
  }

  const updateTeamRequests = async (teamId: string, userId: string) => {
    const teamRef = doc(useCollection('teams'), teamId);
    
    try {
      await runTransaction(db, async (transaction) => {
        const teamDoc = await transaction.get(teamRef);
        if (!teamDoc.exists()) {
          throw new Error('Team does not exist');
        }

        // add userId to requests
        const currentRequests = teamDoc.data().requests || [];
        if (!currentRequests.includes(userId)) {
          transaction.update(teamRef, {
            requests: [...currentRequests, userId]
          });
        }

        // add teamId to user's teams collection
        const userRef = doc(useCollection('users'), userId);
        await transaction.update(userRef, {
          teams: arrayUnion(teamId)
        });
      });
    } catch (error) {
      console.error('Error updating team requests:', error);
      throw error;
    }
  };

  const getOlderTeams = async (limitCount: number, lastTeamId?: string) => {
    setLoading(true);
    try {
      const teamsRef = useCollection('teams');
      let q;

      if (lastTeamId) {
        const lastTeamDoc = await getDoc(doc(teamsRef, lastTeamId));
        q = query(teamsRef,
          orderBy('id'), 
          startAfter(lastTeamDoc),
          limit(limitCount)
        );
      } else {
        q = query(teamsRef,
          orderBy('id'),
          limit(limitCount) 
        );
      }

      const teamDocs = await getDocs(q);
      console.log("older team docs:", teamDocs);
      const teams = teamDocs.docs
        .map((doc) => ({ ...doc.data(), id: doc.id } as Team));

      console.log("older teams:", teams);

      const hasMore = teams.length >= limitCount;

      return { teams, hasMore };
    } catch (error) {
      console.error('Error fetching older teams:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    userTeams,
    loading,
    error,
    updateTeamInvites,
    updateTeamInvitesByEmail,
    updateTeammates,
    getAllTeams,
    getOlderTeams,
    getTeams,
    createTeam,
    leaveTeam,
    updateTeamHost,
    deleteTeam,
    teamNameExists,
    updateRequests,
    updateTeamRequests
  };
}



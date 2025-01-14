import { useState } from 'react';
import {
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteDoc,
  where,
  query,
  addDoc,
  arrayUnion,
  runTransaction,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Invite, Team } from '@/types/Teams';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { useCollection, testLog } from './useCollection';

export function useTeams() {
  const { user } = useUser()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserTeams = async () => {
    setLoading(true);
    testLog('fetching teams for user:', user?.id)

    if (!user?.id) return;
    testLog('user?.id', user?.id)

    try {
      const userRef = doc(useCollection('users'), user?.id);
      const userDoc = await getDoc(userRef);
      testLog('userDoc', userDoc.data())

      const teamsData: string[] = userDoc.exists() ? userDoc.data()?.teams || [] : [];
      const teams = await getTeams(teamsData);
      testLog('teams', teams)

      return teams;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }  

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
        toast.error(``);
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
    const teamDoc = await getDoc(teamRef);
    if (!teamDoc.exists()) {
      toast.error(`Team ${teamId} not found`);
      return false;
    }

    const currentTeammates = teamDoc.data().teammates || [];
    if (currentTeammates.includes(teammateId)) {
      toast.error(`User ${teammateId} already in team ${teamId}`);
      return false;
    }

    await updateDoc(teamRef, {
      teammates: arrayUnion(teammateId)
    });

    return true;
  }

  const updateTeamHost = async (teamId: string, hostId: string) => {
    const teamRef = doc(useCollection('teams'), teamId);
    await updateDoc(teamRef, {
      hostId: hostId
    });
  }

  const getTeams = async (teamIds: string[]) => {
    testLog('teamIds', teamIds)
    setLoading(true);
    
    try {
      testLog('Starting Promise.all')
      const teams = await Promise.all(teamIds.map(async (teamId) => {
        testLog('fetching teamId', teamId)
        const teamRef = doc(useCollection('teams'), teamId);
        const teamDoc = await getDoc(teamRef);
        testLog('teamDoc', teamDoc.data())

        if (!teamDoc.exists()) {
          testLog(`Team ${teamId} not found`);
          return null;
        }
        
        const data = teamDoc.data();
        testLog(`Team ${teamId} data:`, data);
        
        return {
          ...data,
          id: teamId
        } as Team;
      }));
      testLog('Promise.all completed', teams);
      return teams.filter(team => team !== null) as Team[];
    } catch (error) {
      testLog('Error in getTeams:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const createTeam = async (team: Team, userTeams: Team[]) => {
    if (userTeams.some(userTeam => userTeam.hackathonId === team.hackathonId)) {
      return 'alreadyInTeam';
    }

    const teamRef = useCollection('teams');
    const docRef = await addDoc(teamRef, team);

    // Add id to the doc after creation
    await updateDoc(docRef, {
      id: docRef.id
    });

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
    setLoading(true);
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
      const userDoc = await getDoc(userRef);
      const userInvites = userDoc.data()?.invites || [];
      const updatedInvites = userInvites.filter((invite: Invite) => invite.teamId !== teamId);
      
      await updateDoc(userRef, {
        teams: arrayUnion(teamId),
        invites: updatedInvites
      });
    }
    setLoading(false);
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
      });
    } catch (error) {
      console.error('Error updating team requests:', error);
      throw error;
    }
  };

  const getAllTeams = async (userTeamIds: string[]) => {
    setLoading(true);
    try {
      const teamsRef = useCollection('teams');
      const q = query(teamsRef, orderBy('id'));
      const querySnapshot = await getDocs(q);
      const teams = querySnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as Team))
        .filter((team) => !userTeamIds.includes(team.id));
      return teams;
    } catch (error) {
      console.error('Error fetching all teams:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getExploreTeams = async (userTeamIds: string[], limitCount: number, lastTeamId?: string) => {
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
      testLog('USERTEAMS:', userTeamIds);
      const teamDocs = await getDocs(q);
      const teams = teamDocs.docs
        .map((doc) => ({ ...doc.data(), id: doc.id } as Team))
        .filter((team) => !userTeamIds.includes(team.id))
        .slice(0, limitCount);

      testLog('TEAMS LEFT/LIMIT:', teams.length, limitCount);
      const hasMore = teams.length !== 0;

      return { teams, hasMore };
    } catch (error) {
      testLog('Error fetching older teams:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const teammateExists = async (teamId: string, teammateEmail: string) => {
    const usersRef = useCollection('users');
    const q = query(usersRef, where('email', '==', teammateEmail), where('teams', 'array-contains', teamId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  const checkIfUserHasTeam = async (teams: string[] | undefined, hackathonId: string) => {
    if (!teams) return false;

    setLoading(true);
    try {
      // Get all team docs for the user's teams
      const teamDocs = await Promise.all(
        teams.map(async (teamId) => {
          const teamRef = doc(useCollection('teams'), teamId);
          const teamDoc = await getDoc(teamRef);
          return teamDoc.exists() ? teamDoc.data() : null;
        })
      );

      // Filter out null values and check if any team has the hackathonId
      const teamForHackathon = teamDocs
        .filter((team): team is Team => team !== null)
        .filter(team => team.hackathonId === hackathonId);

      return teamForHackathon;
    } catch (error) {
      testLog('Error checking if user has team:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getUserTeams,
    updateTeamInvites,
    updateTeamInvitesByEmail,
    updateTeammates,
    getAllTeams,
    getExploreTeams,
    getTeams,
    createTeam,
    leaveTeam,
    updateTeamHost,
    deleteTeam,
    teamNameExists,
    updateRequests,
    updateTeamRequests,
    teammateExists,
    checkIfUserHasTeam
  };
}



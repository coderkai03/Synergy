import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { Invite, Team } from '@/types/Teams';
import { User } from '@/types/User';
import { useUser } from '@clerk/nextjs';


export function useTeams() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);

  useEffect(() => {
    async function fetchTeams() {
      console.log('fetching teams for user:', user?.id)

      if (!user?.id) return;

      try {
        const userRef = doc(db, 'users', user?.id);
        const userDoc = await getDoc(userRef);
        const teamsData = userDoc.exists() ? userDoc.data()?.teams || [] : [];
        const teams = await getTeams(teamsData);
        console.log('teams', teams)
        setUserTeams(teams);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
        setLoading(false);
      }
    }
    fetchTeams();
  }, [user]);
  

  const updateTeamInvites = async (teammateIds: string[], userId: string, invite: Invite) => {
    try {
      // Update each team document
      await Promise.all(teammateIds.map(async (teammateId) => {
        const inviteeRef = doc(db, 'users', teammateId);
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

  const updateTeammates = async (teamId: string, teammateId: string) => {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);
    const currentTeammates = teamDoc.exists() ? teamDoc.data().teammates || [] : [];
    await updateDoc(teamRef, {
      teammates: [...currentTeammates, teammateId]
    });
  }

  const getTeams = async (teamIds: string[]) => {
    console.log('teamIds', teamIds)
    const teams = await Promise.all(teamIds.map(async (teamId) => {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      console.log('teamDoc', teamDoc.data())
      return {
        ...teamDoc.data(),
        id: teamId
      } as Team;
    }));
    return teams;
  }

  const getAllHackathons = async () => {
      const teams = await getDocs(collection(db, "teams"));
      return teams.docs.map((doc) => ({id: doc.id, ...doc.data()}) as Team);
    }

  return { userTeams, loading, error, updateTeamInvites, updateTeammates, getTeams };
}


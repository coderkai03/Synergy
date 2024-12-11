import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Team } from '@/types/Teams';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const teamsCollection = collection(db, 'teams');
        const teamsSnapshot = await getDocs(teamsCollection);
        const teamsData = teamsSnapshot.docs.map(doc => ({
          hackathonId: doc.id,
          status: Math.random() > 0.5 ? 'active' : 'pending',
          ...doc.data()
        })) as Team[];
        console.log(teamsData);
        setTeams(teamsData);
        setLoading(false);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return { teams, loading, error };
}

export function useUserTeams(teams: Team[], userId: string) {
  const [userTeams, setUserTeams] = useState<Team[]>([]);

  useEffect(() => {
    const filteredTeams = teams.filter(team => 
      team.teammates.includes(userId)
    );
    setUserTeams(filteredTeams);
  }, [teams, userId]);

  return { userTeams };
}


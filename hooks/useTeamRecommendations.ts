"use client";

import { useState } from 'react';
import { Team } from '@/types/Teams';
import { User } from '@/types/User';
import { testLog } from './useCollection';
import { toast } from 'react-hot-toast';
import { TeamWithUserData } from '@/types/TeamWithUserData';

export interface TeamRecommendation {
  recommendations: string[]
}

export function useTeamRecommendations() {
  const [loading, setLoading] = useState(false);

  const getTeamsForHackathon = async (hackathonId: string) => {
    // First, fetch all teams for the hackathon
    const teamsResponse = await fetch(`/api/teams/hackathon/${hackathonId}`);
    if (!teamsResponse.ok) throw new Error('Failed to fetch teams');
    const teams = (await teamsResponse.json()).teams as Team[];
    
    if (teams.length === 0) {
      toast.error('No teams found for the hackathon');
      throw new Error('No teams found for the hackathon');
    }

    // Fetch full user data for all teammates in all teams
    const teamsWithUserData = await Promise.all(teams.map(async (team) => {
      const teammatesWithData = await Promise.all(team.teammates.map(async (teammateId) => {
        const userResponse = await fetch(`/api/users/${teammateId}`);
        if (!userResponse.ok) {
          console.error(`Failed to fetch user data for ${teammateId}`);
          return null;
        }
        const userData = await userResponse.json();
        return userData.user as User;
      }));

      // Filter out any failed user fetches and return team with full user data
      return {
        ...team,
        teammates: teammatesWithData.filter(Boolean)
      };
    }));

    return teamsWithUserData as TeamWithUserData[];
  }

  const getTeamRecommendations = async (
    hackathonId: string,
    userData: User,
    teamsWithUserData: TeamWithUserData[]
  ) => {
    setLoading(true);
    try {
      

      // Then, get GPT recommendations with full user data
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData,
          teams: teamsWithUserData,
          hackathonId
        })
      });

      if (!response.ok) throw new Error('Failed to get recommendations');
      const result = (await response.json()).recommendations.recommendations as string[];
      testLog("hook result:", result)
      return result;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getTeamRecommendations,
    getTeamsForHackathon,
    loading
  };
} 
"use client";

import { useState } from 'react';
import { Team } from '@/types/Teams';
import { User } from '@/types/User';

export function useTeamRecommendations() {
  const [loading, setLoading] = useState(false);

  const getTeamRecommendations = async (hackathonId: string, userData: User) => {
    setLoading(true);
    try {
      // First, fetch all teams for the hackathon
      const teamsResponse = await fetch(`/api/teams/hackathon/${hackathonId}`);
      if (!teamsResponse.ok) throw new Error('Failed to fetch teams');
      const teams = await teamsResponse.json() as Team[];

      // Then, get GPT recommendations
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData,
          teams,
          hackathonId
        })
      });

      if (!response.ok) throw new Error('Failed to get recommendations');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return {
    getTeamRecommendations,
    loading
  };
} 
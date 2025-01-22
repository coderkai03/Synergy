"use client";

import { useState } from 'react';
import { Team } from "@/types/Teams";
import { User } from "@/types/User";
import { TeamPreview } from "./team-preview";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useTeamRecommendations } from '@/hooks/useTeamRecommendations';

interface GPTTeamRecommendationsProps {
  userData: User;
  hackathonId: string;
}

export function GPTTeamRecommendations({ userData, hackathonId }: GPTTeamRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<(Team & { reasoning: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getTeamRecommendations } = useTeamRecommendations();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const result = await getTeamRecommendations(hackathonId, userData);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {recommendations.length === 0 ? (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-zinc-400 text-center">
            Let AI find your perfect team based on your skills and experience.
          </p>
          <Button
            onClick={handleGetRecommendations}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isLoading ? "Finding perfect matches..." : "Get AI Recommendations"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recommended Teams</h3>
            <Button
              onClick={() => setRecommendations([])}
              variant="outline"
              className="text-zinc-400 hover:text-white"
              size="sm"
            >
              Clear
            </Button>
          </div>
          
          {recommendations.map((team, index) => (
            <div key={team.id} className="space-y-2">
              <TeamPreview team={team} />
              <p className="text-sm text-zinc-400 px-4">
                <span className="text-amber-500">AI Reasoning:</span> {team.reasoning}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
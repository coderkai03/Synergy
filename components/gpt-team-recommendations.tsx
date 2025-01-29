"use client";

import { useState } from 'react';
import { Team } from "@/types/Teams";
import { User } from "@/types/User";
import { TeamPreview } from "./team-preview";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useTeamRecommendations } from '@/hooks/useTeamRecommendations';
import { useMatchRequests } from '@/hooks/useMatchRequests';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { testLog } from '@/hooks/useCollection';

interface GPTTeamRecommendationsProps {
  userData: User;
  hackathonId: string;
  isGracePeriod: boolean;
}

interface TeamData {
  teams: Team[];
}

export function GPTTeamRecommendations({ 
  userData, 
  hackathonId,
  isGracePeriod 
}: GPTTeamRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<TeamData>({ teams: [] });
  const [isLoading, setIsLoading] = useState(false);
  const { getTeamRecommendations, getTeamsForHackathon } = useTeamRecommendations();
  const { createMatchRequest } = useMatchRequests();
  const router = useRouter();

  // Handle instant recommendations
  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const teamsForHackathon = await getTeamsForHackathon(hackathonId);
      const result = await getTeamRecommendations(hackathonId, userData, teamsForHackathon);
      testLog("result:", result)
      const teams = await fetch(`/api/teams/some`, {
        method: 'POST',
        body: JSON.stringify({ teamIds: result })
      });
      const teamData = await teams.json();
      testLog("teamData:", teamData)
      setRecommendations(teamData);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast.error('Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle waitlist request
  const handleMatchRequest = async () => {
    setIsLoading(true);
    try {
      await createMatchRequest(userData.id, hackathonId);
      toast.success("✨ AI Match request submitted!");
      router.push('/home');
    } catch (error) {
      console.error('Failed to submit match request:', error);
      toast.error('Failed to submit match request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {isGracePeriod ? (
        // Waitlist Mode
        <div>
          <h2 className="text-zinc-400 mb-6 my-8 leading-relaxed">
            Join the waitlist to get matched!
            <br/>
            <br/>
            We&apos;ll notify you when we&apos;ve found recommendations.
          </h2>
          <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={handleMatchRequest}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isLoading ? "Submitting request..." : "Join AI Match Waitlist"}
            </Button>
          </div>
        </div>
      ) : (
        // Instant Mode
        recommendations.teams.length === 0 ? (
          <div>
            <h2 className="text-zinc-400 mb-6 my-8">
              Let AI find your perfect team in seconds.
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={handleGetRecommendations}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                disabled={isLoading || !hackathonId}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isLoading ? "Finding perfect matches..." : "Get AI Recommendations"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recommended Teams</h3>
              <Button
                onClick={() => setRecommendations({ teams: [] })}
                variant="outline"
                className="text-zinc-400 hover:text-white"
                size="sm"
              >
                Clear
              </Button>
            </div>
            
            {recommendations.teams.map((team) => (
              <div key={team.id} className="space-y-2">
                <TeamPreview team={team} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
} 
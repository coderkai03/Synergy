"use client";

import { useState } from 'react';
import { Team } from "@/types/Teams";
import { User } from "@/types/User";
import { TeamPreview } from "./team-preview";
import { Button } from "./ui/button";
import { Sparkles, Send } from "lucide-react";
import { useTeamRecommendations } from '@/hooks/useTeamRecommendations';
import { Input } from "./ui/input";
import { TeamWithUserData } from '@/types/TeamWithUserData';
import { useMatchRequests } from '@/hooks/useMatchRequests';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useTeams } from '@/hooks/useTeams';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  teams?: Team[];
  reason?: string;
}

interface GPTTeamRecommendationsProps {
  userData: User;
  hackathonId: string;
  isGracePeriod: boolean;
}

export function GPTTeamRecommendations({ userData, hackathonId, isGracePeriod }: GPTTeamRecommendationsProps) {
  const router = useRouter();
  const { createMatchRequest } = useMatchRequests();
  const { getTeams } = useTeams();
  const { getTeamRecommendations, getTeamsForHackathon } = useTeamRecommendations();

  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I can help you find the perfect team. What kind of team are you looking for?"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      // Reset chat and start new conversation
      setMessages([
        {
          role: 'assistant',
          content: "Analyzing your profile to find the best matches..."
        }
      ]);

      const teamsForHackathon = await getTeamsForHackathon(hackathonId);
      const result = await getTeamRecommendations(hackathonId, userData, teamsForHackathon.filter(team => !userData.teams.includes(team.id)), input);
      const teams = await getTeams(result.teamIds);
      
      setMessages([
        {
          role: 'assistant',
          content: "Here are some teams that would be a great match for your skills:",
          teams: teams,
          reason: result.reason
        }
      ]);
    } catch (error) {
      setMessages([
        {
          role: 'assistant',
          content: "Sorry, I encountered an error while finding teams. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
      setInput('');
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
        <div className="space-y-6">
          {/* Match Mode */}
          <div className="min-h-[200px] rounded-md border border-gray-700 p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="space-y-4">
                <p className="text-gray-100">{message.content}</p>
                {message.teams && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {message.teams.map((team) => (
                      <div key={team.id} className="flex flex-col space-y-2">
                        <TeamPreview team={team} />
                      </div>
                    ))}
                  </div>
                )}
                {message.reason && (
                  <p className="text-gray-100">{message.reason}</p>
                )}
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your ideal team..."
              className="flex-1 bg-gray-900 text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleGetRecommendations();
                }
              }}
            />
            <Button
              onClick={handleGetRecommendations}
              className="bg-amber-500 hover:bg-amber-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 
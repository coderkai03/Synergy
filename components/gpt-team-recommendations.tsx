"use client";

import { useState } from 'react';
import { Team } from "@/types/Teams";
import { User } from "@/types/User";
import { TeamPreview } from "./team-preview";
import { Button } from "./ui/button";
import { Sparkles, Send } from "lucide-react";
import { useTeamRecommendations } from '@/hooks/useTeamRecommendations';
import { Input } from "./ui/input";
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
  const { getTeamRecommendations, getTeamsForHackathon, updateAiMatchUses } = useTeamRecommendations();

  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I can help you find the perfect team. What kind of team are you looking for?"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiMatchUses, setAiMatchUses] = useState(userData.ai_match_uses);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      if (aiMatchUses === 0) {
        throw new Error('No AI Matches left');
      }
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
      await updateAiMatchUses(userData);
      setAiMatchUses(aiMatchUses - 1);

      setMessages([
        {
          role: 'assistant',
          content: "Here's a team that would be a great match for your skills:",
          teams: teams,
          reason: result.reason
        }
      ]);
    } catch (error) {
      console.error('Failed to get team recommendations:', error);
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
      router.push('/');
    } catch (error) {
      console.error('Failed to submit match request:', error);
      toast.error('Failed to submit match request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
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
          <div className="min-h-[200px] rounded-md border border-gray-700 p-4 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="space-y-4">
                  <p className="text-gray-100 whitespace-pre-line">
                    {message.content.split('\n').map((line, i) => (
                      <span
                        key={i}
                        className="typing-animation block"
                        style={{
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: '0.5s'
                        }}
                      >
                        {line}
                      </span>
                    ))}
                  </p>
                  {message.teams && (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                      {message.teams
                        .filter((_, index) => index === 0) // Show first team for now
                        .map((team) => (
                        <div key={team.id} className="flex flex-col space-y-2">
                          <TeamPreview team={team} />
                        </div>
                      ))}
                    </div>
                  )}
                  {message.reason && (
                    <p className="text-gray-100 whitespace-pre-line">
                      {message.reason.split('\n').map((line, i) => (
                        <span
                          key={i}
                          className="typing-animation block"
                          style={{
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '0.5s'
                          }}
                        >
                          {line}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Limit Message */}
            {aiMatchUses === 0 && (
              <div className="text-center mt-8 space-y-2">
                <p className="text-red-300 font-medium">
                  You&apos;ve reached the limit for AI Matches. Matches reset at midnight!
                </p>
                <Button
                  onClick={() => window.location.href = '/explore'}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Explore Teams
                </Button>
              </div>
            )}
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
              disabled={isLoading || aiMatchUses === 0}
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
      <div className="text-center text-sm text-zinc-500">
        AI Matches left: {aiMatchUses}
      </div>
    </div>
  );
} 
"use client";

import { Team } from "@/types/Teams";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Calendar, MapPin, Users, Crown } from 'lucide-react';
import { useEffect, useState } from "react";
import { Hackathon } from "@/types/Hackathons";
import { User } from "@/types/User";
import { useHackathons } from "@/hooks/useHackathons";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { HackerPreview } from "./hacker-preview";
import { HackerProfileDialog } from "./hacker-profile-dialog";

interface TeamProfileContentProps {
  team: Team;
  matchScore?: number;
}

export function TeamProfileContent({ team, matchScore }: TeamProfileContentProps) {
  const { getHackathons } = useHackathons();
  const { getUsers } = useFirebaseUser();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teammates, setTeammates] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [hackathons, allUsers] = await Promise.all([
        getHackathons([team.hackathonId]),
        getUsers(team.teammates)
      ]);
      setHackathon(hackathons[0]);
      setTeammates(allUsers);
    };
    fetchData();
  }, [team]);

  if (!hackathon) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {team.hostId && <Crown className="w-5 h-5 text-yellow-500" />}
            {team.name}
          </h2>
          {matchScore && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {matchScore}% Match
            </Badge>
          )}
        </div>
        <img
          src={hackathon.image}
          alt={`${hackathon.name} image`}
          className="rounded-lg w-[100px] h-[100px]"
        />
      </div>

      {/* Hackathon Info */}
      <div className="space-y-2">
        <h3 className="font-semibold">Hackathon Details</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <p className="text-zinc-400">{hackathon.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-zinc-400">{hackathon.date}</p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <p className="text-zinc-400">{hackathon.isOnline ? 'Online' : hackathon.location}</p>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="space-y-2">
        <h3 className="font-semibold">Team Members</h3>
        <div className="space-y-2">
          {teammates.map((teammate) => (
            <HackerProfileDialog key={teammate.id} user={teammate} />
          ))}
        </div>
      </div>
    </div>
  );
} 
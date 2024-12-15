"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Team } from "@/types/Teams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHackathons } from "@/hooks/useHackathons";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTeams } from "@/hooks/useTeams";
import { Hackathon } from "@/types/Hackathons";
import { User } from "@/types/User";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function TeamDetailPage() {
  const params = useParams();
  const { getTeams } = useTeams();
  const { getHackathons } = useHackathons();
  const { getUsers } = useFirebaseUser();

  const id = params.id as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teammates, setTeammates] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const teams = await getTeams([id]);
        setTeam(teams[0]);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  useEffect(() => {
    const fetchHackathonAndTeammates = async () => {
    if (team) {
        if (team.hackathonId) {
            const hackathons = await getHackathons([team.hackathonId]);
            console.log('hackathons', hackathons)
            setHackathon(hackathons[0]);
          }
  
          if (team.teammates) {
            const teammates = await getUsers([
                team.hostId, // Host first
                ...(team.teammates.filter(id => id !== team.hostId)) // Then remaining teammates
            ]);
            console.log('teammates', teammates)
            setTeammates(teammates);
          }
        }
    }
    fetchHackathonAndTeammates();
  }, [team]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!team || !hackathon || !teammates) {
    console.log('team', team)
    console.log('hackathon', hackathon)
    console.log('teammates', teammates)

    return (
      <div className="container mx-auto py-8">
        <Card className="bg-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Team not found</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{team.name}</CardTitle>
          {hackathon && (
            <div className="text-gray-400">
              <p>Hackathon: {hackathon.name}</p>
              <p>Date: {hackathon.date}</p>
              <p>Location: {hackathon.isOnline ? 'Online' : hackathon.location}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Project Details</h3>
              <p><span className="font-medium">Has Project Idea:</span> {team.hasProjectIdea ? 'Yes' : 'No'}</p>
              {team.projectIdea && (
                <p><span className="font-medium">Project Idea:</span> {team.projectIdea}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Problem Space</h3>
              <ul className="list-disc list-inside">
                {team.problemSpaces.map((problem, index) => (
                  <li key={index}>{problem}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Team Description</h3>
              <p>{team.teamDescription}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Goals</h3>
              <ul className="list-disc list-inside">
                {team.goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Team Members</h3>
              <div className="space-y-4">
                {teammates.map((teammate, index) => (
                  <div key={index} className="p-4 bg-zinc-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="text-yellow-500" title="Team Host">👑</span>
                      )}
                      <p className="font-semibold">{teammate.firstName} {teammate.lastName}</p>
                    </div>
                    <p className="text-gray-400">{teammate.email}</p>
                    <div className="mt-2">
                      <p className="text-sm"><span className="font-medium">School:</span> {teammate.school}</p>
                      <p className="text-sm"><span className="font-medium">Major:</span> {teammate.degree}</p>
                      <p className="text-sm"><span className="font-medium">Year:</span> {teammate.gradYear}</p>
                      {teammate.programming_languages && teammate.programming_languages.length > 0 && (
                        <div className="mt-1">
                          <span className="text-sm font-medium">Programming Languages:</span>
                          <ul className="list-disc list-inside text-sm">
                            {teammate.programming_languages.map((lang, i) => (
                              <li key={i}>{lang}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Team Status</h3>
              <p className="capitalize">{team.status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

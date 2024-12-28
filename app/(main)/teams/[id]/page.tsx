"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Team } from "@/types/Teams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHackathons } from "@/hooks/useHackathons";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { useTeams } from "@/hooks/useTeams";
import { Hackathon } from "@/types/Hackathons";
import { User } from "@/types/User";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, LogOut } from 'lucide-react';
import Image from "next/image";
import { LeaveTeamDialog } from "@/components/leave-team-dialog";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getTeams, leaveTeam, updateTeamHost } = useTeams();
  const { getHackathons } = useHackathons();
  const { getUsers, userData } = useFirebaseUser();

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
          setHackathon(hackathons[0]);
        }

        if (team.teammates) {
          const teammates = await getUsers([
            team.hostId,
            ...team.teammates.filter(id => id !== team.hostId)
          ]);
          setTeammates(teammates);
        }
      }
    };
    fetchHackathonAndTeammates();
  }, [team]);

  const handleLeaveTeam = async (newHostId?: string) => {
    if (!team || !userData) return;
    try {
      if (newHostId) {
        // First update the host
        await updateTeamHost(team.id, newHostId);
      }
      // Then leave the team
      await leaveTeam(team.id, userData.id);
      router.push('/teams');
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!team || !hackathon || !teammates.length) {
    return <TeamNotFound />;
  }

  return (
    <div className="mx-auto py-8 px-4 bg-[#111119] text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                <Image
                  src={hackathon.image}
                  alt={`${hackathon.name} image`}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold mb-2 text-white">{team.name}</CardTitle>
                {hackathon && (
                  <div className="text-gray-300 space-y-1">
                    <p className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {hackathon.name}
                    </p>
                    <p className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {hackathon.date}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {hackathon.isOnline ? 'Online' : hackathon.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant={team.status === 'active' ? 'default' : 'secondary'} className="text-sm">
                active {/* {team.status} */}
              </Badge>
              {userData && team.teammates.includes(userData.id) && (
                <LeaveTeamDialog
                  team={team}
                  userData={userData}
                  teammates={teammates}
                  onLeaveTeam={handleLeaveTeam}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <TeamSection title="Team Members">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {teammates.map((teammate, index) => (
                  <TeamMemberCard
                    key={index}
                    teammate={teammate}
                    isHost={index === 0}
                    isCurrentUser={userData?.id === teammate.id}
                  />
                ))}
              </div>
            </TeamSection>
          </div>
        </CardContent>
      </div>
    </div>
  );
}

function TeamSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
      {children}
    </section>
  );
}

function TeamMemberCard({ teammate, isHost, isCurrentUser }: { 
  teammate: User; 
  isHost: boolean;
  isCurrentUser: boolean;
}) {
  return (
    <Card className='bg-gray-900 border-gray-700'>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-gray-700 text-white">
              {teammate.firstName[0]}{teammate.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-white">
              {teammate.firstName} {teammate.lastName}
              {isCurrentUser && <span className="ml-2 text-gray-400">(You)</span>}
            </p>
            <p className="text-sm text-gray-300">{teammate.email}</p>
          </div>
          {isHost && (
            <Badge variant="outline" className="ml-auto border-gray-500 text-gray-300">Host</Badge>
          )}
        </div>
        <div className="space-y-1 text-sm text-gray-300">
          <p><span className="font-medium text-white">School:</span> {teammate.school}</p>
          <p><span className="font-medium text-white">Major:</span> {teammate.degree}</p>
          <p><span className="font-medium text-white">Year:</span> {teammate.gradYear}</p>
        </div>
        {teammate.programming_languages && teammate.programming_languages.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1 text-white">Programming Languages:</p>
            <div className="flex flex-wrap gap-1">
              {teammate.programming_languages.map((lang, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-gray-800 text-gray-200">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto py-8 px-4 bg-[#111119]">
      <Card className="bg-gray-900">
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2 bg-gray-800" />
          <Skeleton className="h-4 w-1/4 mb-1 bg-gray-800" />
          <Skeleton className="h-4 w-1/4 mb-1 bg-gray-800" />
          <Skeleton className="h-4 w-1/4 bg-gray-800" />
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-1/4 mb-3 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-full mb-2 bg-gray-800" />
                <Skeleton className="h-4 w-3/4 bg-gray-800" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamNotFound() {
  return (
    <div className="mx-auto py-8 px-4 bg-[#111119] min-h-screen">
      <Card className="bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Team not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Sorry, we couldn't find the team you're looking for. It may have been removed or you may have entered an incorrect URL.</p>
        </CardContent>
      </Card>
    </div>
  );
}
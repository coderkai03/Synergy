"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Invite, Team } from "@/types/Teams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHackathons } from "@/hooks/useHackathons";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { useTeams } from "@/hooks/useTeams";
import { Hackathon } from "@/types/Hackathons";
import { User } from "@/types/User";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Crown } from 'lucide-react';
import Image from "next/image";
import { LeaveTeamDialog } from "@/components/leave-team-dialog";
import { AddTeammateDialog } from "@/components/add-teammate-dialog";
import { RequestsDialog } from "@/components/requests-dialog";
import { JoinTeamDialog } from "@/components/join-team-dialog";
import { toast } from "react-hot-toast";
import NotFound from "@/components/not-found";
import Loading from "@/components/loading";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const { loading: teamLoading, getTeams, leaveTeam, updateTeamHost, updateTeamInvitesByEmail, teammateExists } = useTeams();
  const { loading: hackathonLoading, getHackathons } = useHackathons();
  const { loading: userLoading, getUsers, userData } = useFirebaseUser();

  const id = params.id as string;
  const [team, setTeam] = useState<Team | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teammates, setTeammates] = useState<User[]>([]);
  const [requests, setRequests] = useState<string[]>([]);

  const isMember = team?.teammates.includes(userData?.id || '');

  const handleAddTeammate = async (email: string) => {
    if (!team || !userData) return;

    if (await teammateExists(team.id, email)) {
      toast.error('User is already in team!');
      return;
    }

    try {
      const invite: Invite = {
        teamId: team.id,
        inviterId: userData.id,
      };
      await updateTeamInvitesByEmail([email], userData.id, invite);
      const updatedTeam = await getTeams([team.id]);
      setTeam(updatedTeam[0]);
    } catch (error) {
      console.error("Failed to add teammate:", error);
    }
  };

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id) return;
      
      try {
        // setLoading(true);
        const teams = await getTeams([id]);
        setTeam(teams[0]);
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        // setLoading(false);
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

        if (team.requests) {
          setRequests(team.requests);
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
        await updateTeamHost(team.id, newHostId);
      }
      await leaveTeam(team.id, userData.id);
      router.push('/teams');
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  if (
    !userData &&
    !teamLoading &&
    !hackathonLoading &&
    !userLoading &&
    !team &&
    !hackathon
  ) {
    return <NotFound />;
  }

  if (
    userLoading ||
    teamLoading ||
    hackathonLoading
  ) {
    return <Loading />;
  }

  const teamContent = () => {
    if (!team || !hackathon) {
      return;
    }

    return (
      <>
        <CardHeader>
          <div className="flex items-start gap-6">
            <div className="flex items-start gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={hackathon.image}
                    alt={`${hackathon.name} image`}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full" />
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
              <div className="flex flex-col gap-4">
                {userData && (
                  <>
                    {isMember ? (
                      <LeaveTeamDialog
                        team={team}
                        userData={userData}
                        teammates={teammates}
                        onLeaveTeam={handleLeaveTeam} />
                    ) : (
                      <JoinTeamDialog
                        team={team}
                        userData={userData} />
                    )}
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <TeamSection title="Team Members">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white">Team Members</h3>
                  <div className="flex gap-4">
                    {userData && userData.id === team.hostId && (
                      <>
                        <RequestsDialog
                          teamId={team.id}
                          requests={requests}
                          teammates={teammates}
                          setTeammates={setTeammates} />
                        <AddTeammateDialog
                          isHost={userData.id === team.hostId}
                          onAddTeammate={handleAddTeammate} />
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {teammates.map((teammate, index) => (
                    <TeamMemberCard
                      key={index}
                      teammate={teammate}
                      isHost={index === 0} />
                  ))}
                </div>
              </TeamSection>
            </div>
          </CardContent>
        </>
    )
  }

  return (
    <div className="mx-auto py-8 px-4 bg-[#111119] text-white min-h-screen">
      <div className="container min-h-screen mx-auto px-4 py-8">
        {teamContent()}
      </div>
    </div>
  );
}

function TeamSection({ children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      {children}
    </section>
  );
}

function TeamMemberCard({ teammate, isHost }: { 
  teammate: User; 
  isHost: boolean;
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
            </p>
            {/* <p className="text-sm text-gray-300">{teammate.email}</p> */}
          </div>
          {isHost && (
            <Crown className="ml-auto w-5 h-5 text-yellow-500" />
          )}
        </div>
        <div className="space-y-1 text-sm text-gray-300">
          <p><span className="font-medium text-white">School:</span> {teammate.school}</p>
          <p><span className="font-medium text-white">Major:</span> {teammate.major}</p>
        </div>
        {teammate.technologies && teammate.technologies.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1 text-white">Programming Languages:</p>
            <div className="flex flex-wrap gap-1">
              {teammate.technologies.map((tech, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-gray-800 text-gray-200">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-3">
          {teammate.linkedin && (
            <a href={teammate.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
          {teammate.github && (
            <a href={teammate.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          {teammate.devpost && (
            <a href={teammate.devpost} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.002 1.61L0 12.004L6.002 22.39h11.996L24 12.004L17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31c0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.646 0 3.862-1.55 3.862-3.861c.009-2.569-1.096-3.853-3.767-3.853z"/>
              </svg>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

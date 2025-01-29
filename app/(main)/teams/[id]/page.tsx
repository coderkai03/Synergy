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
import { Calendar, MapPin, Users, Crown, Github, Globe, Linkedin } from 'lucide-react';
import Image from "next/image";
import { LeaveTeamDialog } from "@/components/leave-team-dialog";
import { AddTeammateDialog } from "@/components/add-teammate-dialog";
import { RequestsDialog } from "@/components/requests-dialog";
import { JoinTeamDialog } from "@/components/join-team-dialog";
import { toast } from "react-hot-toast";
import NotFound from "@/components/not-found";
import Loading from "@/components/loading";
import { useUser } from "@clerk/nextjs";
import { testLog } from "@/hooks/useCollection";

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useUser();

  const { loading: teamLoading, getTeams, leaveTeam, updateTeamHost, updateTeamInvitesByEmail, teammateExists } = useTeams();
  const { loading: hackathonLoading, getHackathons } = useHackathons();
  const { loading: userLoading, getUsers, getUserData } = useFirebaseUser();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [teammates, setTeammates] = useState<User[]>([]);
  const [requests, setRequests] = useState<string[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const userData = await getUserData(user.id);

      if (!userData) return;
      setUserData(userData);
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!userData) return;
    setIsMember(team?.teammates.includes(userData?.id || '') || false);
  }, [userData, team]);

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
                        userData={userData}
                        userLoading={userLoading} />
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
        <div className="flex justify-end gap-3 mt-4">
          {teammate.linkedin && (
            <a href={teammate.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
            </a>
          )}
          {teammate.github && (
            <a href={teammate.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
            </a>
          )}
          {teammate.devpost && (
            <a href={teammate.devpost} target="_blank" rel="noopener noreferrer">
              <Globe className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

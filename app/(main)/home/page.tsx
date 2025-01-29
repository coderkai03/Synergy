"use client"

import { NextHackathon } from '@/components/next-hackathon'
import { UpcomingHackathons } from '@/components/upcoming-hackathons'
import { Hackathon } from '@/types/Hackathons'
import { Team } from '@/types/Teams'
import { useTeams } from '@/hooks/useTeams'
import { useHackathons } from '@/hooks/useHackathons'
import { useFirebaseUser } from '@/hooks/useFirebaseUsers'
import { useEffect, useState } from 'react'
import Loading from '@/components/loading'
import { User } from '@/types/User'
import { useUser } from '@clerk/nextjs'

export default function DashboardPage() {
  const { user } = useUser();
  const { getUserData, loading: userLoading } = useFirebaseUser();
  const { loading: hackathonLoading, getUpcomingHackathons } = useHackathons();
  const { loading: teamLoading, checkIfUserHasTeam } = useTeams();

  const [userData, setUserData] = useState<User | null>(null);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [upcomingHackathons, setUpcomingHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    const fetchUpcomingHackathons = async () => {
      const hackathons = await getUpcomingHackathons(5);
      setUpcomingHackathons(hackathons);
    }
    fetchUpcomingHackathons();
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchUserData = async () => {
      const userData = await getUserData(user?.id);
      if (!userData) return;
      setUserData(userData);
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchUpcomingTeam = async () => {
      if (upcomingHackathons.length === 0) return;
      const teamForHackathon = await checkIfUserHasTeam(userData?.teams, upcomingHackathons[0].id);

      setUserTeam(teamForHackathon ? teamForHackathon[0] : null);
    }

    fetchUpcomingTeam();
  }, [upcomingHackathons, userData]);

  if (hackathonLoading || teamLoading || userLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      <div className="container mx-auto px-8 py-8">
          {upcomingHackathons.length > 0 && (
            <div className="flex flex-col gap-4">
              <NextHackathon
                userData={userData}
                userTeam={userTeam}
                hackathon={upcomingHackathons[0]}
            />
            <UpcomingHackathons
              hackathons={upcomingHackathons.slice(1, 5)}
              userData={userData}
              />
            </div>
          )}
      </div>
    </div>
  )
}

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

export default function DashboardPage() {
    const { userData } = useFirebaseUser();
    const { loading: hackathonLoading, getUpcomingHackathons } = useHackathons();
    const { loading: teamLoading, getTeams } = useTeams();

    const [userTeam, setUserTeam] = useState<Team | null>(null);
    const [upcomingHackathons, setUpcomingHackathons] = useState<Hackathon[]>([]);

  useEffect(() => {
    const fetchUserTeam = async () => {
      if (!userData) return;

      const teams = await getTeams([userData.id]);
      setUserTeam(teams[0]);
    }

    const fetchUpcomingHackathons = async () => {
      const hackathons = await getUpcomingHackathons(4);
      setUpcomingHackathons(hackathons);
    }

    fetchUserTeam();
    fetchUpcomingHackathons();
  }, [userData]);

  if (hackathonLoading || teamLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      <div className="container mx-auto px-8 py-8">
          {/* <div className="w-full">
              <h1 className="text-2xl font-bold mb-4 text-white text-left">Hey {user?.firstName} 👋</h1>
          </div> */}
          <NextHackathon
            userData={userData}
            userTeam={userTeam}
            hackathon={upcomingHackathons[0]}
          />
          <UpcomingHackathons
            hackathons={upcomingHackathons}
            userData={userData} />
      </div>
    </div>
  )
}

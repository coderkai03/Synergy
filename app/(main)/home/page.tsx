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
    const { loading: teamLoading, checkIfUserHasTeam } = useTeams();

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
    const fetchUpcomingTeam = async () => {
      if (upcomingHackathons.length === 0) return;
      const teamForHackathon = await checkIfUserHasTeam(userData?.teams, upcomingHackathons[0].id);

      setUserTeam(teamForHackathon ? teamForHackathon[0] : null);
    }

    fetchUpcomingTeam();
  }, [upcomingHackathons]);

  if (hackathonLoading || teamLoading) return <Loading />;

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

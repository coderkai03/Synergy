"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useTeams } from "@/hooks/useTeams"
import { useHackathons } from "@/hooks/useHackathons"
import { Team } from "@/types/Teams"
import { Hackathon } from "@/types/Hackathons"
import { TeamPreview } from "@/components/team-preview"
import { SearchBar } from "@/components/ui/SearchBar"

export default function AllActiveTeamsScreen() {
  const router = useRouter()
  const { userTeams } = useTeams();
  const { getHackathons } = useHackathons();

  const [activeTeams, setActiveTeams] = useState<Team[]>([])
  const [userHackathons, setUserHackathons] = useState<Hackathon[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!userTeams?.length) return;

    const active = userTeams//.filter(team => team.status === 'active');
    setActiveTeams(active);

    const fetchHackathons = async () => {
      const hackathonIds = active.map(team => team.hackathonId);
      const hackathons = await getHackathons(hackathonIds);
      setUserHackathons(hackathons as Hackathon[]);
      console.log('hackathons', hackathons)
    };
    fetchHackathons();
  }, [userTeams]);

  const filteredTeams = activeTeams.filter(team => {
    const teamNameMatch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    const hackathon = userHackathons.find(h => h.id === team.hackathonId);
    const hackathonNameMatch = hackathon?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return teamNameMatch || hackathonNameMatch;
  });

  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`)
  }

  return (
    <div className="p-4 min-h-screen bg-[#111119]">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">All Active Teams</h1>
        <SearchBar
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userHackathons && filteredTeams.map((team) => {
            const hackathon = userHackathons.find(h => h.id === team.hackathonId);
            return hackathon ? (
              <div key={team.id} onClick={() => handleTeamClick(team.id)}>
                <TeamPreview team={team} hackathon={hackathon} />
              </div>
            ) : null;
          })}
        </div>
      </main>
    </div>
  )
}


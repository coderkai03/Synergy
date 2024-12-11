"use client"

import { useEffect, useState } from "react"
import { SearchBar } from "@/components/ui/SearchBar"
import { TeamPreview } from "@/components/team-preview"
import { useRouter } from 'next/navigation'
import { useTeams } from "@/hooks/useTeams"
import { useHackathons } from "@/hooks/useHackathons"
import { Team } from "@/types/Teams"
import { useUser } from "@clerk/nextjs"

export default function HackathonTeamsScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { teams, loading: teamsLoading, error: teamsError } = useTeams()
  const { hackathonsList } = useHackathons()
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const { user } = useUser()
  
  useEffect(() => {
    if (!user || !teams) return
    
    const filtered = teams.filter(team => 
      team.teammates.includes(user.id)
    )
    setUserTeams(filtered)
  }, [teams, user])

  const filteredTeams = userTeams.filter((team) => {
    const hackathon = hackathonsList.find(h => h.id === team.hackathonId)
    if (!hackathon) return false
    const matchesSearch = hackathon.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = statusFilter === "all" || team.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const handleTeamClick = (teamId: string) => {
    router.push(`/team/${teamId}`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Hackathon Teams</h1>
      <SearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const hackathon = hackathonsList.find(h => h.id === team.hackathonId)!
          return (
            <div key={team.hackathonId} onClick={() => handleTeamClick(team.hackathonId)}>
              <TeamPreview team={team} hackathon={hackathon} />
            </div>
          )
        })}
      </div>
    </div>
  )
}


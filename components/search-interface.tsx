'use client'

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHackathons } from "@/hooks/useHackathons"
import { useTeams } from "@/hooks/useTeams"
import { HackersList } from "./HackersList"
import { TeamsList } from "@/components/TeamsList"
import { SearchBar } from "@/components/ui/SearchBar"
import { Hackathon } from "@/types/Hackathons"
import { Team } from "@/types/Teams"

export function SearchInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [allHackathons, setAllHackathons] = useState<Hackathon[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const { getAllHackathons } = useHackathons()
  const { userTeams } = useTeams() //getAllTeams isn't exported 

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const hackathons = await getAllHackathons()
        setAllHackathons(hackathons)
        setAllTeams(userTeams)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchAllData()
  }, [getAllHackathons, userTeams])


  const filteredHackathons = allHackathons.filter(hackathon =>
    hackathon.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTeams = allTeams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="teams" className="flex-1">Teams</TabsTrigger>
          <TabsTrigger value="hackers" className="flex-1">Hackers</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <TeamsList teams={filteredTeams} hackathons={filteredHackathons}/>
        </TabsContent>
        <TabsContent value="hackers">
          <HackersList teams={filteredTeams}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}




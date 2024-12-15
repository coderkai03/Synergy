"use client"

import { use, useEffect, useState } from "react"
import { SearchBar } from "@/components/ui/SearchBar"
import { TeamPreview } from "@/components/team-preview"
import { useRouter } from 'next/navigation'
import { useTeams } from "@/hooks/useTeams"
import { useHackathons } from "@/hooks/useHackathons"
import { Invite, Team } from "@/types/Teams"
import { useUser } from "@clerk/nextjs"
import { InviteDialog } from "@/components/invite-dialog"
import { useFirebaseUser } from "@/hooks/useFirebaseUsers"
import { getDoc } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { User } from "@/types/User"
import { Hackathon } from "@/types/Hackathons"

export default function HackathonTeamsScreen() {
  const router = useRouter()
  const { user } = useUser()
  const { userData } = useFirebaseUser();
  const { getHackathons } = useHackathons();
  const { userTeams } = useTeams();

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userHackathons, setUserHackathons] = useState<Hackathon[]>([])

  useEffect(() => {
    console.log('found userTeams:', userTeams);
    const fetchHackathons = async () => {
      const hackathons = await getHackathons(userTeams.map(team => team.hackathonId))
      setUserHackathons(hackathons as Hackathon[])
      console.log(userHackathons)
    }
    fetchHackathons()
    console.log('userData:', userData)
    
  }, [userTeams, userData])

  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`)
  }

  if (userTeams.length === 0) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <InviteDialog invites={userData?.invites || []} />
      </div>
      <SearchBar
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userHackathons && userTeams?.map((team, index) => {
          return (
            <div key={team.id} onClick={() => handleTeamClick(team.id)}>
              <TeamPreview team={team} hackathon={userHackathons[index]} />
            </div>
          )
        })}
      </div>
    </div>
  )
}


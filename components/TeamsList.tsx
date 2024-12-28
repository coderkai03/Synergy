'use client'

import { Team } from "@/types/Teams"
import { Hackathon } from "@/types/Hackathons"

interface TeamsListProps {
  teams: Team[]
  hackathons: Hackathon[]
}

export function TeamsList({ teams, hackathons }: TeamsListProps) {
  const getHackathonName = (hackathonId: string) => {
    const hackathon = hackathons.find(h => h.id === hackathonId)
    return hackathon?.name || "Unknown Hackathon"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <div key={team.id} className="p-4 border rounded-lg shadow">
          <h3 className="font-semibold">{team.name}</h3>
          <p className="text-sm text-gray-600">
            Hackathon: {getHackathonName(team.hackathonId)}
          </p>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Members: {team.teammates?.length || 0}</p>
            {team.projectIdea && (
              <p className="text-sm text-gray-600">Project: {team.projectIdea}</p>
            )}
          </div>
        </div>
      ))}
      {teams.length === 0 && (
        <p className="text-gray-500">No teams found</p>
      )}
    </div>
  )
}
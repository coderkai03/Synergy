'use client'

import { Team } from "@/types/Teams"

interface HackersListProps {
  teams: Team[]
}

export function HackersList({ teams }: HackersListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <div key={team.id} className="p-4 border rounded-lg shadow">
          <h3 className="font-semibold">{team.name}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Members:</p>
            {team.teammates?.map((member, index) => (
              <p key={index} className="text-sm">{member}</p>
            ))}
          </div>
        </div>
      ))}
      {teams.length === 0 && (
        <p className="text-gray-500">No hackers found</p>
      )}
    </div>
  )
}
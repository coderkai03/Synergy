"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeamPreview } from '@/components/team-preview'
import { Hackathon } from '@/types/Hackathons'
import { Team } from '@/types/Teams'
import { HackathonCard } from './hackathon-card'
import { User } from '@/types/User'
import Link from 'next/link'

interface NextHackathonProps {
  userData: User | null,
  userTeam: Team | null,
  hackathon: Hackathon
}

export function NextHackathon({
    userData,
    userTeam,
    hackathon
}: NextHackathonProps) {
  return (
    <Card className="w-full transition-colors bg-transparent text-white border border-gray-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Next Hackathon</span>
          <div className="flex items-center gap-4">
            <span className="border-r border-gray-600 pr-4">Next Team</span>
            <Link href="/teams">
              <Button
                variant="outline"
                className="border-[#ffac4c] border-2 text-[#ffac4c] hover:text-[#ffac4c] bg-transparent hover:bg-transparent cursor-pointer"
              >
                All Teams
              </Button>
            </Link>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            {hackathon ? (
                <HackathonCard
                    hackathon={hackathon}
                    userData={userData}
                    previewOnly={true}
                />
            ) : (
                <div>Loading...</div>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center border-l border-gray-600 pl-4">
            {userTeam ? (
              <TeamPreview team={userTeam} />
            ) : (
              <div className="flex flex-col gap-4 items-center justify-center h-full">
                <p className="text-lg text-white">You don't have a team yet.</p>
                <Link href={`/teams/create?hackathonId=${hackathon.id}`}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white w-40">
                      Create Team
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                      variant="outline" 
                      className="border-[#ffac4c] border-2 text-[#ffac4c] hover:text-[#ffac4c] bg-transparent hover:bg-transparent cursor-pointer w-40">Explore Teams</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


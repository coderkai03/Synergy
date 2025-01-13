"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Hackathon } from '@/types/Hackathons'
import { HackathonCard } from './hackathon-card'
import { User } from '@/types/User'
import Loading from './loading'

interface UpcomingHackathonsProps {
  hackathons: Hackathon[]
  userData: User | null
}

export function UpcomingHackathons({
    hackathons,
    userData
}: UpcomingHackathonsProps) {
  return (
    <Card className="bg-[#111119] text-white">
      <CardHeader>
        <CardTitle className="text-white">Upcoming Hackathons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-4">
          {hackathons ? hackathons.map((hackathon) => (
            <div key={hackathon.id}>
              <HackathonCard
                hackathon={hackathon}
                userData={userData}
                previewOnly={false}
                />
            </div>
          )) : <div>Loading...</div>}
        </div>
      </CardContent>
    </Card>
  )
}


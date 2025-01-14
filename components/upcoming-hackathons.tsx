"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Hackathon } from '@/types/Hackathons'
import { HackathonCard } from './hackathon-card'
import { User } from '@/types/User'
import Loading from './loading'
import { Button } from './ui/button'
import Link from 'next/link'

interface UpcomingHackathonsProps {
  hackathons: Hackathon[]
  userData: User | null
}

export function UpcomingHackathons({
    hackathons,
    userData
}: UpcomingHackathonsProps) {
  return (
    <Card className="w-full transition-colors bg-transparent text-white border border-gray-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Upcoming Hackathons</span>
          <Link href="/hackathons">
            <Button
              variant="outline"
              className="border-[#ffac4c] border-2 text-[#ffac4c] hover:text-[#ffac4c] bg-transparent hover:bg-transparent cursor-pointer"
            >
              View All
            </Button>
          </Link>
        </CardTitle>
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


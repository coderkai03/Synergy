"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Team } from '@/types/Teams';
import { TeamPreview } from './team-preview';
import { Button } from './ui/button';
import Link from 'next/link';
import { RequireProfile } from './require-profile';

interface UpcomingTeamsProps {
  teams: Team[];
}

export function UpcomingTeams({ teams }: UpcomingTeamsProps) {
  return (
    <Card className="w-full transition-colors bg-transparent text-white border border-gray-700">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Upcoming Teams</span>
          <Link href="/teams">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teams.length > 0 ? teams.map((team) => (
            <TeamPreview key={team.id} team={team} />
          )) : (
            <div className="flex flex-col gap-4 items-center justify-center h-full col-span-3">
                <p className="text-lg text-white">You don&apos;t have any teams yet.</p>
                <Link href="/explore">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white w-40">
                    Explore Teams
                  </Button>
                </Link>
                <RequireProfile>
                  <Link href={`/teams/create`}>
                    <Button
                      variant="outline"
                      className="border-[#ffac4c] border-2 text-[#ffac4c] hover:text-[#ffac4c] bg-transparent hover:bg-transparent cursor-pointer w-40">
                      Form Team
                    </Button>
                  </Link>
                </RequireProfile>
              </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
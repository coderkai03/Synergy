import { Team } from "@/types/Teams"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Crown } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Hackathon } from "@/types/Hackathons"
import { useUser } from "@clerk/nextjs"
import { useHackathons } from "@/hooks/useHackathons"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { testLog } from "@/hooks/useCollection"

interface TeamPreviewProps {
  team: Team;
}

export function TeamPreview({ team }: TeamPreviewProps) {
  const router = useRouter();
  const { user } = useUser();
  const { getHackathons } = useHackathons();

  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const isHost = user?.id === team.hostId;

  useEffect(() => {
    const fetchHackathon = async () => {
      const hackathons = await getHackathons([team.hackathonId]);
      setHackathon(hackathons[0]);
      testLog('team:', team);
      testLog('hackathon:', hackathons[0]);
    };
    fetchHackathon();
  }, [team.hackathonId]);

  const onTeamClick = (id: string) => {
    testLog('url:', `/teams/${id}`);
    router.push(`/teams/${id}`);
  };

  if (!team || !hackathon) return null;
  
  return (
    <div key={team.id} onClick={() => onTeamClick(team.id)}>
      <Card className="w-full hover:bg-gray-700 transition-colors cursor-pointer bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex justify-center items-center gap-2">
              {isHost && (
                <Crown className="w-4 h-4 text-yellow-500 -mt-1" />
              )}
              <span>{team.name}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-300 truncate">{hackathon.name}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-300 truncate">{hackathon.date}</p>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-300 truncate">{hackathon.isOnline ? 'Online' : hackathon.location}</p>
              </div>

              <div className="flex items-center space-x-2 my-4">
                <div className="flex -space-x-2">
                  {team.teammates.slice(0, 3).map((teammate, index) => (
                    <Avatar key={index} className="border-2 border-gray-800">
                      <AvatarFallback className="bg-gray-600 text-white">{teammate[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <p className="text-sm text-gray-300">{team.teammates.length} teammates</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <img
                src={hackathon.image}
                alt={`${hackathon.name} image`}
                width={80}
                height={80}
                className="rounded-lg w-[100px] h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import { Team } from "@/types/Teams"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Crown } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Hackathon } from "@/types/Hackathons"
import { useUser } from "@clerk/nextjs"

interface TeamPreviewProps {
  team: Team;
  hackathon: Hackathon;
}

export function TeamPreview({ team, hackathon }: TeamPreviewProps) {
  const { user } = useUser();
  const isHost = user?.id === team.hostId;

  if (!team || !hackathon) return null;
  
  return (
    <Card className="w-full hover:bg-gray-700 transition-colors cursor-pointer bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex justify-center items-center gap-2">
            {isHost && (
              <Crown className="w-4 h-4 text-yellow-500 -mt-1" />
            )}
            <span>{team.name}</span>
          </div>
          <Badge
            variant={team.status === 'active' ? 'default' : 'outline'}
            className={team.status === 'active' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}
          >
            {team.status}
          </Badge>
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
  )
}


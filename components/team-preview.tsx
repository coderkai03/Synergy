import { Team } from "@/types/Teams"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Hackathon } from "@/types/Hackathons"

interface TeamPreviewProps {
  team: Team;
  hackathon: Hackathon;
}

export function TeamPreview({ team, hackathon }: TeamPreviewProps) {
  if (!team || !hackathon) return null;
  
  return (
    <Card className="w-full hover:bg-accent transition-colors cursor-pointer">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{hackathon.name}</span>
          <Badge variant={team.status === 'active' ? 'default' : 'secondary'}>
            {team.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{hackathon.date}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {hackathon.isOnline ? 'Online' : hackathon.location}
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={hackathon.image}
              alt={`${hackathon.name} image`}
              width={80}
              height={80}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <div className="flex -space-x-2">
            {team.teammates.slice(0, 3).map((teammate, index) => (
              <Avatar key={index} className="border-2 border-background">
                <AvatarFallback>{teammate[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{team.teammates.length} teammates</p>
        </div>
      </CardContent>
    </Card>
  )
}


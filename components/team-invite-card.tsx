import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RequestButton } from "@/components/request-button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, MessageSquare } from 'lucide-react'

interface TeamInviteCardProps {
  author: string
  teamName: string
  hackathonName: string
  openSpots: number
  description: string
}

export function TeamInviteCard({ author, teamName, hackathonName, openSpots, description }: TeamInviteCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-blue-200">
      <CardHeader className="bg-blue-600 text-white p-4">
        <CardTitle className="text-xl font-bold">{teamName}</CardTitle>
        <p className="text-sm opacity-80">{author}</p>
      </CardHeader>
      <CardContent className="p-4 space-y-4 bg-white">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          <p className="text-sm font-medium text-blue-800">{hackathonName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-blue-800">
            Open spots: <span className="font-semibold">{openSpots}</span>
          </p>
        </div>
        <div className="flex items-start space-x-2">
          <MessageSquare className="w-4 h-4 text-blue-500 mt-1" />
          <p className="text-sm text-blue-800">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-blue-50 p-4 flex justify-between items-center">
        <Badge variant={openSpots === 0 ? "secondary" : "default"} className="bg-blue-100 text-blue-800">
          {openSpots === 0 ? "Team is full" : `${openSpots} spot${openSpots !== 1 ? 's' : ''} available`}
        </Badge>
        <RequestButton teamName={teamName} disabled={openSpots === 0} />
      </CardFooter>
    </Card>
  )
}


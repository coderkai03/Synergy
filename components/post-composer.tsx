"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTeams } from "@/hooks/useTeams"
import { useHackathons } from "@/hooks/useHackathons"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"

export function PostComposer() {
  const [message, setMessage] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("")
  const { userTeams } = useTeams()
  const { hackathons } = useHackathons()
  const { user } = useUser()

  const handlePost = async () => {
    if (!message || !selectedTeam) return
    
    // TODO: Implement post creation logic
    console.log("Posting:", { message, teamId: selectedTeam })
    
    // Reset form
    setMessage("")
    setSelectedTeam("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex-row gap-4 items-center">
        <Avatar>
          <AvatarFallback>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {userTeams.map((team) => {
              const hackathon = hackathons.find(h => h.id === team.hackathonId)
              return (
                <SelectItem key={team.id} value={team.id}>
                  {hackathon?.name} - {team.name}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="What do you want to share?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px] resize-none"
        />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={() => {
          setMessage("")
          setSelectedTeam("")
        }}>
          Cancel
        </Button>
        <Button 
          onClick={handlePost}
          disabled={!message || !selectedTeam}
          className="bg-amber-500 hover:bg-amber-600"
        >
          Post
        </Button>
      </CardFooter>
    </Card>
  )
} 
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, X } from 'lucide-react'
import { useState } from "react"

interface Invite {
  id: number
  inviter: string
  teamName: string
}

export function InviteDialog() {
  const [invites, setInvites] = useState<Invite[]>([
    { id: 1, inviter: "Alice", teamName: "Team Alpha" },
    { id: 2, inviter: "Bob", teamName: "Team Beta" },
    { id: 3, inviter: "Charlie", teamName: "Team Gamma" },
  ])

  const handleJoin = (inviteId: number) => {
    // Logic to join the team
    console.log(`Joined team from invite ${inviteId}`)
    setInvites(invites.filter(invite => invite.id !== inviteId))
  }

  const handleDecline = (inviteId: number) => {
    setInvites(invites.filter(invite => invite.id !== inviteId))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Mail className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Invitations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {invites.map((invite) => (
            <div key={invite.id} className="flex items-center justify-between p-2 border rounded">
              <span>{invite.inviter} invited you to join {invite.teamName}</span>
              <div>
                <Button variant="ghost" size="sm" onClick={() => handleDecline(invite.id)}>
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="default" size="sm" onClick={() => handleJoin(invite.id)}>
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}


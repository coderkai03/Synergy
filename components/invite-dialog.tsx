import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, X } from 'lucide-react'
import { useEffect, useState } from "react"
import { Invite, Team } from "@/types/Teams"
import { useRouter } from "next/navigation"
import { useFirebaseUser } from "@/hooks/useFirebaseUsers"
import { useUser } from "@clerk/nextjs"
import { useTeams } from "@/hooks/useTeams"
import { User } from "@/types/User"

export function InviteDialog({ invites }: { invites: Invite[] }) {
  const { user } = useUser();
  const { updateTeammates } = useTeams();
  const { getUsers, updateUserInvites } = useFirebaseUser();
  const { getTeams } = useTeams();

  const [isOpen, setIsOpen] = useState(false);
  const [inviters, setInviters] = useState<User[]>([]);
  const [teamInvites, setTeamInvites] = useState<Team[]>([]);

  useEffect(() => {
    const fetchInviters = async () => {
      if (!invites?.length) return;
      console.log('invites:', invites);

      const inviterIds = invites.map(invite => invite.inviterId);
      const users = await getUsers(inviterIds);
      setInviters(users);
      console.log('inviters:', users);

      const teamIds = invites.map(invite => invite.teamId);
      const teams = await getTeams(teamIds);
      setTeamInvites(teams);
      console.log('teamInvites:', teams);
    };

    fetchInviters();
    
  }, [invites]);

  const handleJoin = (inviteId: number) => {
    if (!user?.id) return;

    const teamId = invites[inviteId].teamId;
    updateTeammates(teamId, user.id);
    updateUserInvites(inviteId, invites, true);

    console.log(`Joined team from invite ${inviteId}`)
    setIsOpen(false);
  }

  const handleDecline = (inviteId: number) => {
    if (!user?.id) return;

    updateUserInvites(inviteId, invites, false);

    console.log(`Declined invite ${inviteId}`)
    setIsOpen(false);
  }

  if (!invites || !inviters || !teamInvites) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          {invites ? invites.map((invite, index) => (
            <div key={invite.inviterId} className="flex items-center justify-between p-2 border rounded">
              <span>{inviters[index]?.firstName || ''} invited you to join {teamInvites[index]?.name}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleDecline(index)}>
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="default" size="sm" onClick={() => handleJoin(index)}>
                  Join
                </Button>
              </div>
            </div>
          )) : <div>No invites</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}


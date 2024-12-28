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
import { Hackathon } from "@/types/Hackathons"
import { useHackathons } from "@/hooks/useHackathons"
import { toast } from "react-hot-toast"

export function InviteDialog({
  invites,
  teams,
  hackathons,
  setTeams, 
  setHackathons 
}: { 
  invites: Invite[], 
  teams: Team[],
  hackathons: Hackathon[],
  setTeams: (teams: Team[]) => void, 
  setHackathons: (hackathons: Hackathon[]) => void 
}) {
  const { user } = useUser();
  const { updateTeammates } = useTeams();
  const { getUsers, updateUserInvites } = useFirebaseUser();
  const { getTeams } = useTeams();
  const { getHackathons } = useHackathons();

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

  const handleJoin = async (inviteId: number) => {
    if (!user?.id) return;

    const teamId = invites[inviteId].teamId;
    updateTeammates(teamId, user.id);
    updateUserInvites(inviteId, invites, true);

    const team = await getTeams([teamId]);
    
    if (team[0].teammates.length < 4) {
      setTeams([...teams, team[0]]);
    } else {
      toast.error("Team is already full");
      return;
    }

    const hackathonId = team[0].hackathonId;
    const hackathon = await getHackathons([hackathonId]);
    setHackathons([...hackathons, hackathon[0]]);

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
        <Button variant="outline" size="icon" className="relative">
          <Mail className="h-4 w-4" />
          {invites?.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {invites.length}
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Invitations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {invites ? invites.map((invite, index) => (
            <div key={index} className="flex flex-col p-3 border rounded">
              <div className="text-sm text-muted-foreground mb-1">
                from {inviters[index]?.firstName || 'Unknown'}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    Invited you to join {teamInvites[index]?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hackathons.find(h => h.id === teamInvites[index]?.hackathonId)?.name || 'Unknown Hackathon'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDecline(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" onClick={() => handleJoin(index)}>
                    Join
                  </Button>
                </div>
              </div>
            </div>
          )) : <div>No invites</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}


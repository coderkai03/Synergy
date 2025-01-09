import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail } from 'lucide-react'
import { useEffect, useState } from "react"
import { Invite, Team } from "@/types/Teams"
import { useFirebaseUser } from "@/hooks/useFirebaseUsers"
import { useUser } from "@clerk/nextjs"
import { useTeams } from "@/hooks/useTeams"
import { User } from "@/types/User"
import { Hackathon } from "@/types/Hackathons"
import { useHackathons } from "@/hooks/useHackathons"
import { toast } from "react-hot-toast"
import { InviteCard } from "@/components/invite-card"
import { testLog } from "@/hooks/useCollection";


export function InviteDialog({
  invites,
  teams,
  setTeams, 
  setUserHackathons 
}: { 
  invites: Invite[], 
  teams: Team[],
  setTeams: (teams: Team[]) => void, 
  setUserHackathons: (hackathons: Hackathon[]) => void 
}) {
  const { user } = useUser();
  const { updateTeammates } = useTeams();
  const { getUsers, updateUserInvites } = useFirebaseUser();
  const { getTeams } = useTeams();
  const { getHackathons } = useHackathons();

  const [isOpen, setIsOpen] = useState(false);
  const [inviters, setInviters] = useState<User[]>([]);
  const [teamInvites, setTeamInvites] = useState<Team[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);

  testLog('INV hackathons:', hackathons);

  useEffect(() => {
    const fetchInviters = async () => {
      if (!invites?.length) return;
      testLog('invites:', invites);

      const inviterIds = invites.map(invite => invite.inviterId);
      const users = await getUsers(inviterIds);
      setInviters(users);
      testLog('inviters:', users);

      const teamIds = invites.map(invite => invite.teamId);
      const teams = await getTeams(teamIds);
      setTeamInvites(teams);
      testLog('teamInvites:', teams);

      const hackathonIds = teams.map(team => team.hackathonId);
      const hackathonDocs = await getHackathons(hackathonIds);
      setHackathons(hackathonDocs);
      testLog('hackathons:', hackathonDocs);
    };

    fetchInviters();
    
  }, [invites]);

  const handleJoin = async (inviteId: number) => {
    if (!user?.id) return;

    const teamId = invites[inviteId].teamId;
    const success = await updateTeammates(teamId, user.id);
    if (!success) return;
    
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
    setUserHackathons([...hackathons, hackathon[0]]);

    testLog(`Joined team from invite ${inviteId}`)
    setIsOpen(false);
  }

  const handleDecline = (inviteId: number) => {
    if (!user?.id) return;

    updateUserInvites(inviteId, invites, false);

    testLog(`Declined invite ${inviteId}`)
    setIsOpen(false);
  }

  if (!invites || !inviters || !teamInvites) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-white text-black hover:bg-zinc-200">
          <Mail className="h-4 w-4" />
          {invites?.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {invites.length}
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white">Team Invitations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {invites ? invites.map((invite, index) => {
            const hackathon = hackathons.find(h => h.id === teamInvites[index]?.hackathonId);
            return hackathon ? (
              <InviteCard
                key={index}
                inviter={inviters[index]}
                team={teamInvites[index]}
                hackathon={hackathon}
                onDecline={() => handleDecline(index)}
                onJoin={() => handleJoin(index)}
              />
            ) : null;
          }) : <div className="text-zinc-400">No invites</div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}


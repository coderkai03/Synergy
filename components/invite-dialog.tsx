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
  inviteTeams,
  activeTeams,
  userHackathons,
  setInvites,
  setInviteTeams, 
  setActiveTeams,
  setUserHackathons 
}: { 
  invites: Invite[], 
  inviteTeams: Team[],
  activeTeams: Team[],
  userHackathons: Hackathon[],
  setInvites: (invites: Invite[]) => void,
  setInviteTeams: (teams: Team[]) => void, 
  setActiveTeams: (teams: Team[]) => void,
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
    
    await updateUserInvites(inviteId, invites, true);
    const updatedInvites = invites.filter(invite => invite.teamId !== teamId);
    setInvites(updatedInvites);

    const team = await getTeams([teamId]);
    if (!team[0]) {
      toast.error("Team not found");
      return;
    };

    if (team[0].teammates.length >= 4) {
      toast.error("Team is already full");
      return;
    }

    const updatedInviteTeams = inviteTeams.filter(t => t.id !== teamId);
    setInviteTeams(updatedInviteTeams);

    const updatedActiveTeams = [...activeTeams, team[0]];
    setActiveTeams(updatedActiveTeams);

    const hackathonId = team[0].hackathonId;
    const hackathon = await getHackathons([hackathonId]);
    const updatedUserHackathons = [...userHackathons, hackathon[0]];
    setUserHackathons(updatedUserHackathons);

    testLog(`Joined team from invite ${inviteId}`);
    setIsOpen(false);
  }

  const handleDecline = async (inviteId: number) => {
    if (!user?.id) return;

    await updateUserInvites(inviteId, invites, false);
    const updatedInvites = invites.filter(invite => invite.teamId !== invites[inviteId].teamId);
    setInvites(updatedInvites);

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
          {invites ? invites.map((_, index) => {
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


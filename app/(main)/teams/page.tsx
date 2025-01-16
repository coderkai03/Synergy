"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useTeams } from "@/hooks/useTeams"
import { useHackathons } from "@/hooks/useHackathons"
import { Invite, Team } from "@/types/Teams"
import { InviteDialog } from "@/components/invite-dialog"
import { useFirebaseUser } from "@/hooks/useFirebaseUsers"
import { Hackathon } from "@/types/Hackathons"
import { Button } from "@/components/ui/button"
import { TeamListSection } from "@/components/team-list-section"
import { Plus } from "lucide-react"
import { RequireProfile } from "@/components/require-profile"
import Loading from "@/components/loading"
import NoTeams from "@/components/no-teams"
import { testLog } from "@/hooks/useCollection";

export default function HackathonTeamsScreen() {
  const router = useRouter()
  const { loading: userLoading, userData } = useFirebaseUser();
  const { loading: hackathonLoading, getHackathons } = useHackathons();
  const { loading: teamLoading, getUserTeams } = useTeams();

  const [teams, setTeams] = useState<Team[]>([])
  const [userTeams, setUserTeams] = useState<Team[]>([])
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([...userTeams]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      const teams = await getUserTeams();
      setUserTeams(teams || []);
    }
    fetchUserTeams();
  }, [userData]);

  useEffect(() => {
    testLog('userTeams', userTeams)

    if (!userTeams?.length) {
      testLog("No userTeams found, returning early");
      return;
    }

    testLog('checked userTeams', userTeams)

    setInvites(userData?.invites || []);
    setTeams(userTeams);
    setFilteredTeams(userTeams
      .sort((a, b) => a.name.localeCompare(b.name)));

    testLog('filteredTeams', filteredTeams);

    const fetchHackathons = async () => {
      if (!userTeams?.length) return;
      const hackathonIds = userTeams.map(team => team.hackathonId);
      const hackathons = await getHackathons(hackathonIds);
      setHackathons(hackathons as Hackathon[]);
    };
    fetchHackathons();
  }, [userTeams]);

  if (
    userLoading ||
    teamLoading ||
    hackathonLoading
  ) {
    testLog('teams: ', teamLoading);
    testLog('hackathons: ', hackathonLoading);
    testLog('user: ', userLoading);
    return <Loading />;
  }

  const teamsPage = () => {
    return (
      <>
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Teams</h1>
          <div className="flex gap-4">
            <RequireProfile>
              <Button variant="outline" onClick={() => router.push('/teams/create')} className="gap-2 text-black">
                <Plus className="w-4 h-4" /> Form Team
              </Button>
            </RequireProfile>
            <InviteDialog
              invites={invites}
              inviteTeams={teams}
              activeTeams={filteredTeams}
              userHackathons={hackathons}
              setInvites={setInvites}
              setInviteTeams={setTeams}
              setActiveTeams={setFilteredTeams}
              setUserHackathons={setHackathons}
            />
          </div>
        </div>
        <div className="space-y-8">
          {filteredTeams?.length > 0 && hackathons?.length > 0 ? (
            <TeamListSection
              teams={filteredTeams}
              hackathons={hackathons}
            />
          ) : (
            <NoTeams />
          )}
        </div>
      </>
    )
  }

  return (
    <div className="p-4 min-h-screen bg-[#111119]">
      <main className="container mx-auto px-4 py-8">
        {teamsPage()}
      </main>
    </div>
  )
}

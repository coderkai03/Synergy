"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useTeams } from "@/hooks/useTeams"
import { useHackathons } from "@/hooks/useHackathons"
import { Invite, Team } from "@/types/Teams"
import { useUser } from "@clerk/nextjs"
import { InviteDialog } from "@/components/invite-dialog"
import { useFirebaseUser } from "@/hooks/useFirebaseUsers"
import { User } from "@/types/User"
import { Hackathon } from "@/types/Hackathons"
import { Button } from "@/components/ui/button"
import { TeamListSection } from "@/components/team-list-section"
import { subscribeToDoc } from "@/hooks/useDocSubscription"
import { Plus } from "lucide-react"
import { RequireProfile } from "@/components/require-profile"
import NotFound from "@/components/not-found"
import Loading from "@/components/loading"

export default function HackathonTeamsScreen() {
  const router = useRouter()
  const { user } = useUser()
  const { userData, loading: userLoading } = useFirebaseUser();
  const { loading: hackathonLoading, getHackathons } = useHackathons();
  const { loading: teamLoading, userTeams } = useTeams();

  const [teams, setTeams] = useState<Team[]>([])
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([...userTeams]);

  // Subscribe to teams
  const unsubscribeTeams = subscribeToDoc<Team>({
    collectionName: 'teams',
    docId: userData?.id || '',
    onUpdate: (teamData) => {
      setTeams(prevTeams => {
        const teamIndex = prevTeams.findIndex(t => t.id === teamData.id);
        if (teamIndex >= 0) {
          const newTeams = [...prevTeams];
          newTeams[teamIndex] = teamData;
          return newTeams;
        }
        return [...prevTeams, teamData];
      });
    },
    enabled: !!userData?.id
  });

  // Subscribe to invites
  const unsubscribeInvites = subscribeToDoc<User>({
    collectionName: 'users',
    docId: user?.id || '',
    onUpdate: (userData) => {
      const newInvites = userData.invites || [];
      setInvites(prevInvites => {
        if (JSON.stringify(newInvites) !== JSON.stringify(prevInvites)) {
          console.log('New invite received:', newInvites);
          return newInvites;
        }
        return prevInvites;
      });
    },
    enabled: !!user?.id
  });

  // Unsubscribe from teams and invites
  useEffect(() => {
    return () => {
      if (unsubscribeInvites) unsubscribeInvites();
      if (unsubscribeTeams) unsubscribeTeams();
    };
  }, [user?.id]);


  useEffect(() => {
    console.log('userTeams', userTeams)

    if (!userTeams?.length) {
      console.log("No userTeams found, returning early");
      return;
    }

    console.log('checked userTeams', userTeams)

    setInvites(userData?.invites || []);
    setTeams(userTeams);

    setFilteredTeams(userTeams
      .sort((a, b) => a.name.localeCompare(b.name)));

    console.log('filteredTeams', filteredTeams);

    const fetchHackathons = async () => {
      const hackathonIds = userTeams.map(team => team.hackathonId);
      const hackathons = await getHackathons(hackathonIds);
      setHackathons(hackathons as Hackathon[]);
    };
    fetchHackathons();
  }, [userTeams?.length]);

  if (
    (!userLoading &&
    !teamLoading &&
    !hackathonLoading) &&
    (!userTeams?.length &&
    !hackathons?.length &&
    !invites?.length)
  ) {
    return <NotFound />;
  }

  if (
    userLoading ||
    teamLoading ||
    hackathonLoading
  ) {
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
                <Plus className="w-4 h-4" /> Create Team
              </Button>
            </RequireProfile>
            <InviteDialog
              invites={invites}
              teams={teams}
              setTeams={setTeams}
              setUserHackathons={setHackathons}
            />
          </div>
        </div>
        <div className="space-y-8">
          <TeamListSection
            teams={filteredTeams}
            hackathons={hackathons}
          />
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

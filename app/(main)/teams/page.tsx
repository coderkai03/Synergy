"use client"

import { useEffect, useState } from "react"
import { SearchBar } from "@/components/ui/SearchBar"
import { TeamPreview } from "@/components/team-preview"
import { useRouter } from 'next/navigation'
import { useTeams } from "@/hooks/useTeams"
import { useHackathons } from "@/hooks/useHackathons"
import { Invite, Team } from "@/types/Teams"
import { useUser } from "@clerk/nextjs"
import { InviteDialog } from "@/components/invite-dialog"
import { useFirebaseUser } from "@/hooks/useFirebaseUsers"
import { collection, getDoc, onSnapshot, query, where, documentId } from "firebase/firestore"
import { doc } from "firebase/firestore"
import { db } from "@/firebaseConfig"
import { User } from "@/types/User"
import { Hackathon } from "@/types/Hackathons"

export default function HackathonTeamsScreen() {
  const router = useRouter()
  const { user } = useUser()
  const { userData } = useFirebaseUser();
  const { getHackathons } = useHackathons();
  const { userTeams } = useTeams();

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [teams, setTeams] = useState<Team[]>([])
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [invites, setInvites] = useState<Invite[]>([])

  const subscribeToInvites = () => {
    if (!user?.id) return;

    // Create query for invites where the user is the invitee
    const invitesQuery = query(
      collection(db, "users"), 
      where(documentId(), "==", user.id)
    );

    // Set up realtime listener
    const unsubInvites = onSnapshot(invitesQuery, async (snapshot) => {
      snapshot.forEach((doc) => {
        const userData = doc.data() as User;
        if (userData.invites) {
          setInvites(userData.invites);
        }
      });
    });

    return unsubInvites;
  };

  useEffect(() => {
    subscribeToInvites();
  }, [user?.id]);

  useEffect(() => {
    if (!userTeams?.length) {
      console.log("No userTeams found, returning early");
      return;
    }

    setTeams(userTeams);

    const fetchHackathons = async () => {
      const hackathonIds = userTeams.map(team => team.hackathonId);
      const hackathons = await getHackathons(hackathonIds);
      setHackathons(hackathons as Hackathon[]);
    };
    fetchHackathons();
    
    return () => {
      // unsubTeams();
      // unsubHackathons();
      // unsubInvites();
    };
  }, [userTeams]);

  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`)
  }

  return (
    <div className="container mx-auto py-8 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <InviteDialog
          invites={invites || []} 
          teams={teams}
          hackathons={hackathons}
          setTeams={setTeams} 
          setHackathons={setHackathons} 
        />
      </div>
      <SearchBar
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons && teams?.map((team, index) => {
          return (
            <div key={team.id} onClick={() => handleTeamClick(team.id)}>
              <TeamPreview team={team} hackathon={hackathons[index]} />
            </div>
          )
        })}
      </div>
    </div>
  )
}


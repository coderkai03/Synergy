"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TeamPreview } from "@/components/team-preview";
import { HackerPreview } from "@/components/hacker-preview";
import { useTeams } from "@/hooks/useTeams";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { Search } from "lucide-react";
import { User } from "@/types/User";
import { Team } from "@/types/Teams";
import { useCompatibility } from "@/hooks/useCompatibility";
import { testLog } from "@/hooks/useCollection";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { userData, getOlderUsers, loading: usersLoading } = useFirebaseUser();
  const { getOlderTeams, loading: teamsLoading } = useTeams();
  const { calculateHackerScores } = useCompatibility();

  const PAGE_LIMIT = 10;
  
  const [hackerScores, setHackerScores] = useState<number[]>([]);
  const [filteredHackers, setFilteredHackers] = useState<User[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMoreTeams, setHasMoreTeams] = useState(true);


  const fetchMoreUsers = async () => {
    if (!userData) return;

    const lastUser = filteredHackers ? filteredHackers[filteredHackers.length - 1] : null;
    const {users, hasMore} = await getOlderUsers(PAGE_LIMIT, lastUser?.id);

    if (!hasMore) {
      setHasMoreUsers(false);
    }

    if (!users) return;

    const filteredUsers: User[] = users
      .filter(user => 
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.school?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const hScores = calculateHackerScores(userData, filteredUsers);
    testLog('more hackers:', [...filteredHackers, ...filteredUsers]);

    setFilteredHackers(prev => [...prev, ...filteredUsers]);
    setHackerScores(hScores);
  }

  const fetchMoreTeams = async () => {
    if (!userData) return;

    const lastTeam = filteredTeams ? filteredTeams[filteredTeams.length - 1] : null;
    const {teams, hasMore} = await getOlderTeams(PAGE_LIMIT, lastTeam?.id);

    if (!hasMore) {
      setHasMoreTeams(false);
    }

    if (!teams) return;

    const filteredTeamsList: Team[] = teams
      .filter(team => 
        team.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    testLog('more teams:', [...filteredTeams, ...filteredTeamsList]);

    setFilteredTeams(prev => [...prev, ...filteredTeamsList]);
  }

  if (
    (!teamsLoading &&
    !usersLoading) &&
    (!userData &&
    !filteredHackers?.length &&
    !filteredTeams?.length)
  ) {
    return <NotFound />;
  }

  if (
    usersLoading ||
    teamsLoading
  ) {
    return <Loading />;
  }

  const exploreContent = () => {
    return (
      <>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hackers or teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800/50"
          />
        </div>

        <Tabs defaultValue="hackers" className="w-full">
          <TabsList className="w-full bg-zinc-800">
            <TabsTrigger value="hackers" className="w-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">Hackers</TabsTrigger>
            <TabsTrigger value="teams" className="w-full data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">Teams</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hackers" className="mt-6">
              <InfiniteScroll
                isLoading={usersLoading}
                hasMore={hasMoreUsers}
                next={fetchMoreUsers}
                threshold={0.5}
              >
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                  {filteredHackers?.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between w-full bg-zinc-800/50 rounded-lg">
                    <div className="w-3/4">
                      <HackerPreview user={user} />
                    </div>
                    <div className="text-white text-lg font-medium w-1/4 text-center">
                      {hackerScores[index]?.toFixed(0)}% Match
                    </div>
                  </div>
                ))}
                </div>
              </InfiniteScroll>
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            <InfiniteScroll
              isLoading={teamsLoading}
              hasMore={hasMoreTeams}
              next={fetchMoreTeams}
              threshold={0.5}
            >
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                {filteredTeams?.map((team) => (
                  <div 
                    key={team.id} 
                  className="flex items-center justify-between gap-4 w-full"
                >
                  <div className="flex-1">
                    <TeamPreview team={team} />
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </TabsContent>
        </Tabs>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      <main className="container w-1/2 mx-auto">
        <div className="space-y-6">
          {filteredHackers && exploreContent()}
        </div>
      </main>
    </div>
  );
}

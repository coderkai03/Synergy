"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TeamPreview } from "@/components/team-preview";
import { HackerPreview } from "@/components/hacker-preview";
import { useTeams } from "@/hooks/useTeams";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { Search } from "lucide-react";
import { User, mockHackers } from "@/types/User";
import { Team } from "@/types/Teams";
import { useCompatibility } from "@/hooks/useCompatibility";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { userData } = useFirebaseUser();
  const { getAllTeams } = useTeams();
  const { getAllUsers, loading: usersLoading, getOlderUsers } = useFirebaseUser();
  const { calculateHackerScores, loading: scoresLoading } = useCompatibility();
  
  const [hackerScores, setHackerScores] = useState<number[]>([]);
  const [filteredHackers, setFilteredHackers] = useState<User[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

  const setObserver = () => {
    const observer = new IntersectionObserver(
        async (entries) => {
            if (entries[0].isIntersecting) {
                console.log("Intersecting");
                const olderUsers = await getOlderUsers(filteredHackers[filteredHackers.length - 1].id)
                const filteredUsers = olderUsers.filter(user => 
                    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.school?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredHackers(prev => [...prev, ...filteredUsers]);
            }
        },
        { threshold: 1.0 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }

  useEffect(() => {
    const fetchUsers = async () => {
        if (!userData) return;

        const allUsers: User[] = await getAllUsers();
        const filteredUsers: User[] = [...mockHackers, ...allUsers]
        .filter(user => 
            user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.school?.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 10);

      const hScores = calculateHackerScores(userData, filteredUsers);

      setFilteredHackers(filteredUsers);
      setHackerScores(hScores);
    };

    const fetchTeams = async () => {
      if (!userData) return;

      try {
        const allTeams: Team[] = await getAllTeams();
        const filtered = allTeams
          .filter(team => 
            team.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );

        setFilteredTeams(filtered);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchUsers();
    fetchTeams();
    setObserver();
  }, [userData, searchQuery]);

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      <main className="container w-1/2 mx-auto">
        <div className="space-y-6">
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
              {usersLoading || scoresLoading ? (
                <div>Loading hackers...</div>
              ) : (
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
              )}
            </TabsContent>

            <TabsContent value="teams" className="mt-6">
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
              <div id="sentinel" className="h-1"></div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

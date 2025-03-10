"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamPreview } from "@/components/team-preview";
import { useTeams } from "@/hooks/useTeams";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Team } from "@/types/Teams";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import { useUser } from "@clerk/nextjs";
import { User } from "@/types/User";
import { RequireProfile } from "@/components/require-profile";

export default function ExplorePage() {
  const { user } = useUser();
  const { getAllTeams, loading: teamsLoading } = useTeams();
  const { getUserData, loading: userLoading } = useFirebaseUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    if (!user?.id) return;
    const fetchUserData = async () => {
      const userData = await getUserData(user?.id);
      setUserData(userData);
    };
    fetchUserData();
  }, [user]);

  // Load all teams once
  useEffect(() => {
    const loadTeams = async () => {
      const teams = await getAllTeams();
      setAllTeams(teams);
    };
    loadTeams();
  }, []);

  // Filter teams based on search
  const filteredTeams = allTeams.filter(team => 
    team.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination based on screen size
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const ITEMS_PER_PAGE = isMobile ? 4 : 12; // 1 column on mobile (4 items), 3 columns on desktop (12 items)
  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (userLoading || teamsLoading) {
    return <Loading />;
  }

  if (!allTeams.length) {
    console.log("loading", userLoading, teamsLoading);
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-[#111119] p-4">
      <main className="container mx-auto space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800/50"
          />
        </div>

        {/* Teams Grid */}
        <div className={`grid grid-cols-1 ${!isMobile && 'sm:grid-cols-2 md:grid-cols-3'} gap-4`}>
          {paginatedTeams.map((team) => (
            <RequireProfile key={team.id} userData={userData}>
              <TeamPreview team={team} />
            </RequireProfile>
          ))}
        </div>

        {/* Pagination Controls */}
        {paginatedTeams.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              variant="outline"
              className="bg-zinc-800/50 text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <span className="text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              variant="outline"
              className="bg-zinc-800/50 text-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

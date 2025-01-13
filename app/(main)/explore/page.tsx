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

export default function ExplorePage() {
  const PAGE_LIMIT = 8;
  const { getAllTeams, loading: teamsLoading } = useTeams();
  const { userData, loading: userLoading } = useFirebaseUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Load all teams once
  useEffect(() => {
    const loadTeams = async () => {
      const teams = await getAllTeams(userData?.teams || []);
      setAllTeams(teams);
    };
    if (userData) {
      loadTeams();
    }
  }, [userData]);

  // Filter teams based on search
  const filteredTeams = allTeams.filter(team => 
    team.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredTeams.length / PAGE_LIMIT);
  const startIndex = (currentPage - 1) * PAGE_LIMIT;
  const paginatedTeams = filteredTeams.slice(startIndex, startIndex + PAGE_LIMIT);

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

  if (!userData && !allTeams.length) {
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
        <div className="grid grid-cols-1 gap-4">
          {paginatedTeams.map((team) => (
            <TeamPreview key={team.id} team={team} />
          ))}
        </div>

        {/* Pagination Controls */}
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

        {/* No Results */}
        {filteredTeams.length === 0 && (
          <div className="text-center text-zinc-400 py-8">
            No teams found matching your search.
          </div>
        )}
      </main>
    </div>
  );
}

import { Team } from "@/types/Teams";
import { Hackathon } from "@/types/Hackathons";
import { TeamPreview } from "@/components/team-preview";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useCollection } from "@/hooks/useCollection";

interface TeamListSectionProps {
  teams: Team[];
  hackathons: Hackathon[];
}

export function TeamListSection({
  teams,
  hackathons,
}: TeamListSectionProps) {
  const [requestCounts, setRequestCounts] = useState<Record<string, number>>({});

  const teamsCollection = useCollection('teams');

  useEffect(() => {
    if (!teams?.length || !hackathons?.length) return;

    const unsubscribes = teams.map(team => {
      const teamRef = doc(teamsCollection, team.id);
      return onSnapshot(teamRef, (doc) => {
        const teamData = doc.data();
        setRequestCounts(prev => ({
          ...prev,
          [team.id]: teamData?.requests?.length || 0
        }));
      });
    });

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, [teams, teamsCollection]);

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {teams?.length > 0 && hackathons?.length > 0 ? (
          teams.map((team) => {
            const hackathon = hackathons.find(h => h.id === team.hackathonId);
            return hackathon ? (
              <div key={team.id} className="relative">
                {teams.length > 0 && hackathons.length > 0 && requestCounts[team.id] > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {requestCounts[team.id]}
                  </div>
                )}
                <TeamPreview team={team} />
              </div>
            ) : null;
          })
        ) : (
          <div className="col-span-3 flex items-center justify-center h-40 text-gray-400">No teams found</div>
        )}
      </div>
    </div>
  );
} 
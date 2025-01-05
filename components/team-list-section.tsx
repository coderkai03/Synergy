import { Team } from "@/types/Teams";
import { Hackathon } from "@/types/Hackathons";
import { TeamPreview } from "@/components/team-preview";

interface TeamListSectionProps {
  teams: Team[];
  hackathons: Hackathon[];
}

export function TeamListSection({
  teams,
  hackathons,
}: TeamListSectionProps) {

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons && teams.length > 0 ? (
          teams.slice(0, 3).map((team) => {
            const hackathon = hackathons.find(h => h.id === team.hackathonId);
            return hackathon ? (
              <TeamPreview team={team} />
            ) : null;
        })) : (
          <div className="col-span-3 flex items-center justify-center h-40 text-gray-400">No teams found</div>
        )}
      </div>
    </div>
  );
} 
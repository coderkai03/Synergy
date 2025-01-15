import { Team } from "@/types/Teams";
import { Hackathon } from "@/types/Hackathons";
import { TeamPreview } from "@/components/team-preview";
import { testLog } from "@/hooks/useCollection";

interface TeamListSectionProps {
  teams: Team[];
  hackathons: Hackathon[];
}

export function TeamListSection({
  teams,
  hackathons,
}: TeamListSectionProps) {
  testLog("TeamListSection", teams, hackathons);

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        {teams?.length > 0 && hackathons?.length > 0 && (
          teams.map((team) => {
            const hackathon = hackathons.find(h => h.id === team.hackathonId);
            return hackathon ? (
              <div key={team.id} className="relative">
                <TeamPreview team={team} />
              </div>
            ) : null;
          })
        )}
      </div>
    </div>
  );
} 
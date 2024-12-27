import { Team } from "@/types/Teams";
import { Hackathon } from "@/types/Hackathons";
import { TeamPreview } from "@/components/team-preview";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TeamListSectionProps {
  title: string;
  teams: Team[];
  hackathons: Hackathon[];
  viewAllPath: string;
  onTeamClick: (teamId: string) => void;
}

export function TeamListSection({
  title,
  teams,
  hackathons,
  viewAllPath,
  onTeamClick,
}: TeamListSectionProps) {
  const router = useRouter();

  return (
    <div className="my-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {teams.length > 3 && (
          <Button 
            variant="secondary"
            onClick={() => router.push(viewAllPath)}
          >
            See All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons && teams.slice(0, 3).map((team) => {
          const hackathon = hackathons.find(h => h.id === team.hackathonId);
          return hackathon ? (
            <div key={team.id} onClick={() => onTeamClick(team.id)}>
              <TeamPreview team={team} hackathon={hackathon} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
} 
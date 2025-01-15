import { Hackathon } from '@/types/Hackathons';
import { HackathonCard } from './hackathon-card';
import { User } from '@/types/User';

interface HackathonGridProps {
  hackathons: Hackathon[];
  userData: User | null;
}

export function HackathonGrid({ hackathons, userData }: HackathonGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-4">
      {hackathons.map((hackathon) => (
        <div key={hackathon.id}>
          <HackathonCard
            hackathon={hackathon}
            userData={userData}
            previewOnly={false}
          />
        </div>
      ))}
    </div>
  );
} 
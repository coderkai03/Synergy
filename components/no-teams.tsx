import { Search } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { RequireProfile } from './require-profile';
import { User } from '@/types/User';

interface NoTeamsProps {
  userLoading: boolean;
  userData: User | null;
}

export default function NoTeams({ userLoading, userData }: NoTeamsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-[#111119]">
      <div className="flex flex-col gap-4 items-center justify-center h-full">
        <p className="text-lg text-white text-center">
          You don&apos;t have any teams yet.
        </p>
        <Link href="/explore">
          <Button className="bg-amber-500 hover:bg-amber-600 text-white w-40">
            <Search className="w-4 h-4 mr-2" /> Explore Teams
          </Button>
        </Link>
        {!userLoading && <RequireProfile userData={userData}>
          <Link href="/teams/create">
            <Button
              variant="outline"
              className="border-[#ffac4c] border-2 text-[#ffac4c] hover:text-[#ffac4c] bg-transparent hover:bg-transparent cursor-pointer w-40">
              Form Team
            </Button>
          </Link>
        </RequireProfile>}
      </div>
    </div>
  );
} 
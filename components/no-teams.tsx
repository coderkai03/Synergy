import { Search } from 'lucide-react';
import { Button } from './ui/button';
import SynergyLogo from './synergy-logo';
import Link from 'next/link';

export default function NoTeams() {
  const { getIconSize } = SynergyLogo();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-[#111119]">
      <div className="flex text-xl my-10 sm:text-xl font-bold text-white leading-none">
        {getIconSize('lg')} ucks to be solo...
      </div>
    <div className="flex gap-4 justify-center">
        <Link href="/explore">
            <Button variant="outline" className="gap-2 text-black text-lg">
                <Search className="w-4 h-4" /> Explore Teams
            </Button>
        </Link>
    </div>
      <div className="flex text-xl my-10 sm:text-xl font-bold text-white leading-none">
        ...or create one!
      </div>
    </div>
  );
} 
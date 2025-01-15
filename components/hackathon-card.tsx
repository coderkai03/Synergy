import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import { Hackathon } from "@/types/Hackathons";
import { User } from "@/types/User";
import Image from "next/image";
import SynergyLogo from "./synergy-logo";
import { RequireProfile } from "./require-profile";

interface HackathonCardProps {
  hackathon: Hackathon;
  userData: User | null;
  previewOnly: boolean;
}

export function HackathonCard({
  hackathon, 
  userData, 
  previewOnly
}: HackathonCardProps) {
  const { getIconSize } = SynergyLogo();

  const formatDate = (dateString: string) => {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-[#4A4A4A] border-none flex flex-col max-w-xs">
      <CardHeader className="p-0">
        <Link 
          href={hackathon.website}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer block h-[200px]"
        >
          {hackathon.image ? (
            <Image
              src={hackathon.image}
              alt={hackathon.name}
              width={400}
              height={200}
              className="w-full h-[200px] object-cover rounded-t-lg hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="flex items-center justify-center h-[150px] w-full bg-gray-800 border border-gray-700 shadow-sm rounded-t-lg hover:opacity-80 transition-opacity">
              {getIconSize('xl')}
            </div>
          )}
        </Link>
      </CardHeader>
      <CardContent className="grid gap-2 p-3 mt-auto">
        <h3 className="text-lg font-semibold text-white line-clamp-1">
          {hackathon.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-white">
          <Calendar className="h-4 w-4 text-white" />
          <time dateTime={hackathon.date}>
            {formatDate(hackathon.date)}
            {" - "}
            {formatDate(hackathon.endDate)}
          </time>
        </div>
        <div className="flex items-center gap-2 text-sm text-white">
          {hackathon.isOnline ? (
            <Globe2 className="h-4 w-4 text-white" />
          ) : (
            <MapPin className="h-4 w-4 text-white" />
          )}
          {hackathon.location}
        </div>
        {!previewOnly && <div className="mt-3 flex gap-2">
          <RequireProfile>
            <Button
              asChild
              variant="outline"
              className="flex-1 bg-[#4A4A4A] border-[#ffac4c] border-2 text-[#ffac4c] hover:bg-[#FFAD08]/10 hover:text-[#ffac4c] font-bold"
            >
              <Link href={userData ? `/teams/create${hackathon.id ? `?hackathonId=${hackathon.id}` : ''}` : '/account-setup'}>
                Create Team
              </Link>
            </Button>
          </RequireProfile>
          <Button 
            asChild
            className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold text-white hover:text-white"
          >
            <Link href={`/explore`}>
              Explore
            </Link>
          </Button>
        </div>}
      </CardContent>
    </Card>
  );
} 
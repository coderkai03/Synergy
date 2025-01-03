import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import { Team } from "@/types/Teams";
import { Hackathon } from "@/types/Hackathons";
import { User } from "@/types/User";
import Image from "next/image";
import SynergyLogo from "./synergy-logo";

interface HackathonCardProps {
  hackathon: Hackathon;
  userTeams: Team[];
  userData: User | null;
}

export function HackathonCard({ hackathon, userTeams, userData }: HackathonCardProps) {
  const { getIconSize } = SynergyLogo();

  const formatDate = (dateString: string) => {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const hasApplied = userTeams.some(team => team.hackathonId === hackathon.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-[#4A4A4A] border-none flex flex-col">
      <CardHeader className="p-0">
        {hackathon.image ? (
          <Image
            src={hackathon.image}
            alt={hackathon.name}
            width={400}
            height={200}
            className="w-full h-auto object-top rounded-t-lg"
          />
        ) : ( // Doesn't work; MUST FIX
          <div className="flex items-center justify-center h-[200px] w-full bg-gray-800 border border-gray-700 shadow-sm rounded-t-lg">
            {getIconSize('xl')}
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-3 p-4 mt-auto">
        <h3 className="text-xl font-semibold text-white line-clamp-1">
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
        <div className="mt-4 flex gap-3">
          {hasApplied ? (
            <Button disabled className="flex-1 bg-gray-500 font-bold text-white">
              Applied
            </Button>
          ) : (
            <Button 
              asChild 
              className="flex-1 bg-amber-500 hover:bg-amber-600 font-bold text-white hover:text-white"
            >
              <Link href={userData ? `/hackathons/${hackathon.id}` : '/account-setup'}>
                Form Team
              </Link>
            </Button>
          )}
          <Button 
            asChild 
            variant="outline" 
            className="flex-1 bg-[#4A4A4A] border-[#ffac4c] text-[#ffac4c] hover:bg-[#FFAD08]/10 hover:text-[#ffac4c]"
          >
            <Link
              href={hackathon.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
import Image from "next/image";
import { Hackathon } from "@/types/Hackathons";

interface HackathonPreviewProps {
  hackathon: Hackathon;
}

export function HackathonPreview({ hackathon }: HackathonPreviewProps) {
  if (!hackathon) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="relative w-10 h-10 rounded-md overflow-hidden">
        <Image
          src={hackathon.image}
          alt={hackathon.name}
          width={400}
          height={200}
          className="w-full h-auto object-top rounded-t-lg"
        />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-medium">{hackathon.name}</span>
        <span className="text-xs">
          {new Date(hackathon.date).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
} 
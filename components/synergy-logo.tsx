import Link from "next/link";
import { Zap } from "lucide-react";

export default function SynergyLogo() {
  return (
    <div className="flex items-center">
      <Zap
        className="w-6 h-6 sm:w-8 sm:h-8 -mr-1 rotate-[15deg] scale-x-[0.7]"
        style={{ color: "#FFAD08" }}
      />
      <Link
        href="/"
        className="text-xl sm:text-2xl font-bold text-white leading-none"
      >
        ynergy
      </Link>
    </div>
  );
}

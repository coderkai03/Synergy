import Link from "next/link";
import { Zap } from "lucide-react";

interface SynergyIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function SynergyIcon({ size = 'md', className = '' }: SynergyIconProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  return (
    <div className="flex items-center justify-center">
      <Zap
        className={`${sizeMap[size]} -mr-1 rotate-[15deg] scale-x-[0.7] ${className}`}
        style={{ color: "#FFAD08" }}
      />
    </div>
  );
}

export default function SynergyLogo() {
  const getLogoSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    return (
      <div className="flex items-center">
        <SynergyIcon size={size} />
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-white leading-none"
        >
          ynergy
        </Link>
      </div>
    );
  }

  const getIconSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    return (
      <SynergyIcon size={size} />
    );
  }

  return {getLogoSize, getIconSize};
}


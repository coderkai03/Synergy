"use client";

import { useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { testLog } from "@/hooks/useCollection";
import { useUser } from "@clerk/nextjs";

interface RequireProfileProps {
  children: React.ReactNode;
  userData?: User | null;
}

export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;

  const requiredFields = [
    user.id,
    user.firstName,
    user.lastName,
    user.email,
    user.school,
    user.major,
    user.technologies?.length > 0,
    user.role_experience && Object.keys(user.role_experience).length > 0,
    user.category_experience?.length > 0
  ];

  return requiredFields.every(Boolean);
};

export function RequireProfile({ children, userData }: RequireProfileProps) {
  const router = useRouter();
  
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Only check when loading is complete and we haven't checked yet
    if (!hasChecked) {
      setHasChecked(true);
      // testLog('User data:', userData);
      
      if (userData !== undefined && !isProfileComplete(userData)) {
        testLog('Profile incomplete:', userData);
        router.push('/account-setup');
      }
    }
  }, [userData, hasChecked, router]);

  // If we've checked and the profile is complete, render children
  return <>{children}</>;
} 

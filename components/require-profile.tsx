"use client";

import { useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { testLog } from "@/hooks/useCollection";

interface RequireProfileProps {
  children: React.ReactNode;
}

export function RequireProfile({ children }: RequireProfileProps) {
  const { userData, loading } = useFirebaseUser();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  const isProfileComplete = (user: User | null): boolean => {
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

  useEffect(() => {
    // Only check when loading is complete and we haven't checked yet
    if (!loading && !hasChecked) {
      setHasChecked(true);
      
      if (!isProfileComplete(userData)) {
        testLog('Profile incomplete:', userData);
        router.push('/account-setup');
      }
    }
  }, [userData, loading, hasChecked, router]);

  // If we've checked and the profile is complete, render children
  return <>{children}</>;
} 
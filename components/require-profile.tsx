"use client";

import { useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { toast } from "react-hot-toast";

interface RequireProfileProps {
  children: React.ReactNode;
}

export function RequireProfile({ children }: RequireProfileProps) {
  const { userData } = useFirebaseUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasChecked, setHasChecked] = useState(false);

  const isProfileComplete = (user: User | null): boolean => {
    if (!user) return false;

    const requiredFields = [
      user.firstName,
      user.lastName,
      user.email,
      user.bio,
      user.school,
      user.major,
      user.technologies?.length > 0,
      user.role_experience && Object.keys(user.role_experience).length > 0,
      user.category_experience?.length > 0,
    //   user.interests?.length > 0,
      user.number_of_hackathons,
      user.linkedin,
      user.devpost,
      user.github
    ];

    return requiredFields.every(Boolean);
  };

  useEffect(() => {
    if (userData !== undefined && !hasChecked) {
      setIsLoading(false);
      setHasChecked(true);
      
      if (!isProfileComplete(userData)) {
        router.push('/account-setup');
      }
    }
  }, [userData, hasChecked, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
} 
"use client";

import { useEffect, useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";

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
        console.log('Profile incomplete:', userData);
        router.push('/account-setup');
      }
    }
  }, [userData, loading, hasChecked, router]);

  // Show loading state while we're checking the profile
  if (loading || !hasChecked) {
    return <div className="min-h-screen bg-[#111119] p-4 flex justify-center items-center">
      <div className="container w-1/2 mx-auto">
        <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
          <h1 className="text-2xl font-bold mb-6 text-white">Loading...</h1>
        </div>
      </div>
    </div>;
  }

  // If we've checked and the profile is complete, render children
  return <>{children}</>;
} 
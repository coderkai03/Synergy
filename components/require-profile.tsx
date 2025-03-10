"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import { testLog } from "@/hooks/useCollection";

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

  const handleInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only check if the target is an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.matches('button, a, input, select, textarea') ||
      target.closest('button, a, input, select, textarea');

    if (isInteractive && userData !== undefined && !isProfileComplete(userData)) {
      testLog('Profile incomplete:', userData);
      e.preventDefault();
      e.stopPropagation();
      router.push('/account-setup');
    }
  };

  return (
    <div onClick={handleInteraction}>
      {children}
    </div>
  );
} 

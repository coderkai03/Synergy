"use client";

import { useState, useCallback } from 'react';
import { User } from '@/types/User';
import { Team } from '@/types/Teams';
import OpenAI from 'openai';
import { useFirebaseUser } from './useFirebaseUsers';

export function useCompatibility() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateHackerScores = useCallback((userData: User, users: User[]): number[] => {
    // Role complementarity weights
    const roleWeights: Record<string, Record<string, number>> = {
      software: { design: 0.8, product_management: 0.6, hardware: 0.4 },
      design: { software: 0.8, product_management: 0.6, hardware: 0.4 },
      product_management: { software: 0.7, design: 0.7, hardware: 0.5 },
      hardware: { software: 0.6, design: 0.4, product_management: 0.5 }
    };

    return users.map(otherUser => {
      let score = 0;
      const weights = {
        roleComplementarity: 0.4,
        experienceBalance: 0.3,
        technicalOverlap: 0.2,
        categoryAlignment: 0.1
      };

      // 1. Role Complementarity (40%)
      let roleScore = 0;
      let totalWeight = 0;
      Object.entries(userData.role_experience).forEach(([userRole, userLevel]) => {
        Object.entries(otherUser.role_experience).forEach(([otherRole, otherLevel]) => {
          if (userRole !== otherRole) {
            const weight = roleWeights[userRole]?.[otherRole] || 0;
            totalWeight += weight;
            roleScore += weight * (Math.min(userLevel, otherLevel) / 10);
          }
        });
      });
      roleScore = totalWeight > 0 ? Math.min(100, (roleScore / Math.min(totalWeight, 2)) * 100) : 0;

      // 2. Experience Balance (30%)
      let expScore = 0;
      Object.entries(userData.role_experience).forEach(([role, level]) => {
        const otherLevel = otherUser.role_experience[role as keyof typeof otherUser.role_experience];
        if (typeof level === 'number' && typeof otherLevel === 'number') {
          // More generous scoring for experience differences
          const diff = Math.abs(level - otherLevel);
          expScore += 100 - Math.min(100, diff * 15);
        }
      });
      expScore /= Object.keys(userData.role_experience).length;

      // 3. Technical Overlap (20%)
      const commonTech = userData.technologies?.filter(tech => 
        otherUser.technologies?.includes(tech)
      ).length || 0;
      const uniqueTech = otherUser.technologies?.filter(tech => 
        !userData.technologies?.includes(tech)
      ).length || 0;
      const techScore = Math.min(100, 
        (commonTech * 15) +  // Increased weight for common tech
        (uniqueTech * 7)     // Increased weight for unique tech
      );

      // 4. Category Alignment (10%)
      const commonCategories = userData.category_experience?.filter(cat => 
        otherUser.category_experience?.includes(cat)
      ).length || 0;
      const categoryScore = userData.category_experience?.length > 0 ? 
        (commonCategories / userData.category_experience.length) * 100 : 0;

      // Calculate weighted final score
      score = (
        roleScore * weights.roleComplementarity +
        expScore * weights.experienceBalance +
        techScore * weights.technicalOverlap +
        categoryScore * weights.categoryAlignment
      );

      console.log({
        roleScore,
        expScore,
        techScore,
        categoryScore,
        finalScore: score
      });

      return Math.round(Math.min(100, Math.max(0, score)));
    });
  }, []);

  const calculateTeamScores = useCallback(async (userData: User, team: Team) => {
    if (!userData) return 0;

    // Get all teammate user objects
    const { getAllUsers } = useFirebaseUser();
    const allUsers = await getAllUsers();
    const teammates = allUsers.filter(user => team.teammates.includes(user.id));

    // Calculate compatibility score with each teammate
    const teammateScores = teammates.map(teammate => 
      calculateHackerScores(userData, [teammate])[0]
    );

    // Return average score across all teammates
    return Math.round(teammateScores.reduce((sum, score) => sum + score, 0) / teammateScores.length);
  }, []);

  return {
    calculateHackerScores,
    calculateTeamScores,
    loading,
    error
  };
}

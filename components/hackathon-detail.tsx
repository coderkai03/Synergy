"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types/Teams";
import { useTeams } from "@/hooks/useTeams";
import { TeamForm } from "./team-form";

export function HackathonDetailComponent() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen bg-[#111119] p-4 py-8 text-white">
      <Card className="max-w-2xl mx-auto my-9 text-white bg-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Team Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TeamForm
            hackathonId={id}
          />
        </CardContent>
      </Card>
    </div>
  );
}

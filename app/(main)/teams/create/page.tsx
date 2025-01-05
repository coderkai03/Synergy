"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TeamForm } from "@/components/team-form";

function CreateTeamContent() {
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Create a New Team</h1>
      <TeamForm hackathonId={hackathonId || ""} />
    </div>
  );
}

export default function CreateTeamPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateTeamContent />
    </Suspense>
  );
}

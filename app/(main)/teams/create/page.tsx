"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TeamForm } from "@/components/team-form";
import { RequireProfile } from "@/components/require-profile";

function CreateTeamContent() {
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');

  return (
    <RequireProfile>
      <div className="min-h-screen bg-[#111119] p-4 flex justify-center items-center">
        <main className="container w-1/2 mx-auto">
          <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
            <h1 className="text-2xl font-bold mb-6 text-white">Create a New Team</h1>
            <TeamForm hackathonId={hackathonId || undefined} />
          </div>
        </main>
      </div>
    </RequireProfile>
  );
}

export default function CreateTeamPage() {
  return (
    <Suspense>
      <CreateTeamContent />
    </Suspense>
  );
}

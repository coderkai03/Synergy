"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TeamForm } from "@/components/team-form";
import { RequireProfile } from "@/components/require-profile";
import { useUser } from "@clerk/nextjs";
import { useFirebaseUser } from "@/hooks/useFirebaseUsers";
import { User } from "@/types/User";
import Loading from "@/components/loading";

function CreateTeamContent() {
  const searchParams = useSearchParams();
  const hackathonId = searchParams.get('hackathonId');
  const { user } = useUser();

  const { getUserData, loading: userLoading } = useFirebaseUser();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchUserData = async () => {
      const userData = await getUserData(user?.id);
      if (!userData) return;
      setUserData(userData);
    };
    fetchUserData();
  }, [user]);

  if (userLoading) {
    return <Loading />
  }

  return (
    <div>
      {!userLoading && <RequireProfile userData={userData}>
        <div className="min-h-screen bg-[#111119] p-4 flex justify-center items-center">
          <main className="container w-3/4 h-3/4 mx-auto">
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
              <TeamForm hackathonId={hackathonId || undefined} />
            </div>
          </main>
        </div>
      </RequireProfile>}
    </div>
  );
}

export default function CreateTeamPage() {
  return (
    <Suspense>
      <CreateTeamContent />
    </Suspense>
  );
}

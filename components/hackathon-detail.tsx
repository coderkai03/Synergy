"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamForm } from "./team-form";
import { RequireProfile } from "./require-profile";

export function HackathonDetailComponent() {

  return (
    <div className="min-h-screen bg-[#111119] p-4 py-8 text-white">
      <Card className="max-w-2xl mx-auto my-9 text-white bg-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Team Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RequireProfile>
            <TeamForm />
          </RequireProfile>
        </CardContent>
      </Card>
    </div>
  );
}

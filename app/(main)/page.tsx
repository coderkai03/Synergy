"use client";

import { useUser } from "@clerk/nextjs";
import HomePage from "@/components/home-page";
import LandingPage from "@/components/landing-page";
import Loading from "@/components/loading";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div>
      {isSignedIn ? <HomePage /> : <LandingPage />}
    </div>
  )
}

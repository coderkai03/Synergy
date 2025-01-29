import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { User } from "@/types/User";
import { isProfileComplete } from "./require-profile";

export default function GetStarted({ userData }: { userData: User | null }) {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="w-full flex items-center justify-center">
      {isLoaded && !isSignedIn ? (
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={'/hackathons'}
            signUpForceRedirectUrl={isProfileComplete(userData) ? '/home' : '/account-setup'}
          >
            <div className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xl font-medium text-white transition-all hover:bg-white hover:text-gray-900 cursor-pointer">
              Get Started
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </div>
          </SignInButton>
      ) : (
        <Link
          href='/hackathons'
          className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xl font-medium text-white transition-all hover:bg-white hover:text-gray-900"
        >
          Get Started
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

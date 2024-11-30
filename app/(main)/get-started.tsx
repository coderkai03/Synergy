import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function GetStarted() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="w-full">
      <main className="flex items-center justify-center h-full p-20">
        <div className="w-full md:w-1/2 px-4 py-16 flex flex-col items-center overflow-hidden">
            {isLoaded && !isSignedIn ? (
                <div className="flex gap-4">
                    <SignInButton
                        mode="modal"
                        fallbackRedirectUrl={'/hackathons'}
                        signUpForceRedirectUrl={'/account-setup'}
                    >
                        <Button className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xl font-medium text-white transition-all hover:bg-white hover:text-gray-900">
                        Start building
                        <ArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Button>
                    </SignInButton>
                </div>
            ) : (
                <Link
                    href='/hackathons'
                    className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-6 py-3 text-xl font-medium text-white transition-all hover:bg-white hover:text-gray-900"
                >
                    Start building
                    <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>
      </main>
    </div>
  );
}

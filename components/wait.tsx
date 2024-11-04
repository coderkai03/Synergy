import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HackathonWait() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thanks for signing up to team match with{" "}
            <strong className="text-primary">Synergy</strong>. We will email you
            once we help you find your dream team!
          </p>
          <div className="mt-6 animate-pulse">
            <div className="h-2 bg-primary/20 rounded-full max-w-[200px] mx-auto mb-2"></div>
            <div className="h-2 bg-primary/20 rounded-full max-w-[160px] mx-auto"></div>
          </div>
          <Link
            href="/alpha/hackathons"
            className="mt-6 inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hackathons
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

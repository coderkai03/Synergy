"use client";

import PrivacyPolicy from "@/components/privacy-policy";
//import TermsOfService from "@/components/terms-of-service";

export default function LegalPage() {
  return (
    <div className="justify-center min-h-screen bg-[#111119] p-4">
    <div className="flex justify-center">

      <main className="container mx-auto px-4 py-8">
        <PrivacyPolicy />
        {/* TODO: Add Terms of Service */}
        {/*<TermsOfService />*/}
      </main>
    </div>
    </div>
  );
}

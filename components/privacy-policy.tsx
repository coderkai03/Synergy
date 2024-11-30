"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#111119] p-4">
        <Collapsible className="bg-zinc-800 rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                <h2 className="text-lg font-semibold text-white">Privacy Policy</h2>
                <ChevronDown className="w-5 h-5 text-zinc-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-6 text-zinc-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
                            <p>We collect information that you provide directly to us when you:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Create an account</li>
                                <li>Fill out your profile</li>
                                <li>Interact with other users</li>
                                <li>Participate in hackathons</li>
                                <li>Contact our support team</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
                            <p>We use the collected information to:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Create and manage your account</li>
                                <li>Match you with potential teammates</li>
                                <li>Improve our services</li>
                                <li>Send important updates and notifications</li>
                                <li>Ensure platform security</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Information Sharing</h2>
                            <p>We do not sell your personal information to third parties. We may share your information with:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Other users (based on your privacy settings)</li>
                                <li>Service providers who assist in platform operations</li>
                                <li>Law enforcement when required by law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
                            <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or destruction. However, no method of transmission over the internet is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    </div>
  );
}

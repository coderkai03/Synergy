"use client";

import { motion } from "framer-motion";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="bg-[#111119] p-4">
        <Collapsible className="bg-zinc-800 rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
                <h2 className="text-lg font-semibold text-white">Terms of Service</h2>
                <ChevronDown className="w-5 h-5 text-zinc-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="space-y-6 text-zinc-300">
            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>By accessing and using Synergy Hackathon (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. User Accounts</h2>
                <p>You must create an account to use our services. You agree to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Not share your account credentials</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Platform Rules</h2>
                <p>When using our platform, you agree not to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Harass or discriminate against other users</li>
                    <li>Share inappropriate or offensive content</li>
                    <li>Attempt to breach platform security</li>
                    <li>Impersonate others or provide false information</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
                <p>All content and materials on the Platform are owned by Synergy Hackathon and protected by intellectual property laws. Users retain ownership of their submitted content but grant us a license to use, display, and distribute it on the Platform.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
                <p>The Platform is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages arising from your use of our services or any content posted by users.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Termination</h2>
                <p>We reserve the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion. Users may terminate their accounts at any time.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to Terms</h2>
                <p>We may modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified terms.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Contact</h2>
                <p>For questions about these Terms of Service, please contact us at:</p>
                <p className="mt-2">legal@synergy-hackathon.com</p>
            </section>
            </div>
            </div>
            </CollapsibleContent>
        </Collapsible>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
        >
            
        </motion.div>
    </div>
  );
}

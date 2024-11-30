"use client";

import { motion } from "framer-motion";

export default function ContactUsPage() {
  return (
    <div className="justify-center min-h-screen bg-[#111119] p-4">
      <div className="flex justify-center">
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-zinc-800 rounded-lg p-8"
          >
            <h1 className="text-3xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-zinc-300 mb-8">
              Have questions or need assistance? Feel free to reach out to us at:
            </p>
            <div className="flex items-center justify-center">
              <a 
                href="mailto:hello@synergy-hackathon.com"
                className="text-amber-500 hover:text-amber-400 text-xl font-medium"
              >
                hello@synergy-hackathon.com
              </a>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}


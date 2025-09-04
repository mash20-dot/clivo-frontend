'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";
import Footer from "@/components/landing/Footer";

export default function GetStartedChoicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center gap-7"
        >
          <h2 className="text-2xl font-bold text-teal-700 text-center mb-3">
            How can we help you today?
          </h2>
          <div className="flex flex-col gap-6 w-full">
            <Link href="/auth/signup" className="w-full">
              <button className="w-full flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 px-4 rounded-xl shadow text-lg justify-center transition">
                <User className="w-7 h-7" />
                I am seeking for help
              </button>
            </Link>
            <Link href="/auth/counselor-signup" className="w-full">
              <button className="w-full flex items-center gap-3 bg-white border border-teal-600 text-teal-700 font-semibold py-4 px-4 rounded-xl shadow text-lg justify-center transition hover:bg-teal-50">
                <ShieldCheck className="w-7 h-7" />
                I am a counselor
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
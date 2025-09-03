'use client';
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactCTA() {
  return (
    <section className="w-full py-12 px-0 bg-yellow-50 flex flex-col items-center text-center rounded-2xl my-8 mx-auto max-w-5xl shadow-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <MailCheck className="mx-auto w-8 h-8 text-yellow-400 mb-2" />
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900">Let’s talk about your specific needs</h2>
        <p className="mb-6 text-gray-700">Get the latest in mental health, new features, and updates from Clivo.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/auth/signup" className="bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-700 shadow">
            Try Yourself
          </Link>
          <Link href="/dashboard" className="bg-white border border-teal-600 text-teal-700 font-semibold px-6 py-2 rounded-lg hover:bg-teal-50 shadow">
            Get Started
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
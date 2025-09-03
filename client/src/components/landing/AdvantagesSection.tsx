'use client';
import Image from "next/image";
import Link from "next/link";
import { Dumbbell, CupSoda, Users, Clock, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

const advs = [
  { text: "Complete Daily Task", icon: <Users className="text-teal-600 w-5 h-5" /> },
  { text: "Care of Time Management", icon: <Clock className="text-teal-600 w-5 h-5" /> },
  { text: "Healthy Food", icon: <CupSoda className="text-teal-600 w-5 h-5" /> },
  { text: "Daily Routine", icon: <Clock className="text-teal-600 w-5 h-5" /> },
  { text: "Drinking Water", icon: <CupSoda className="text-teal-600 w-5 h-5" /> },
  { text: "Quality Time with Family", icon: <Users className="text-teal-600 w-5 h-5" /> },
  { text: "Gym Workout", icon: <Dumbbell className="text-teal-600 w-5 h-5" /> },
  { text: "Proper Sound Sleep", icon: <HeartPulse className="text-teal-600 w-5 h-5" /> },
];

export default function AdvantagesSection() {
  return (
    <section className="w-full py-14 px-0 bg-gradient-to-r from-teal-50 via-white to-blue-50 flex flex-col md:flex-row gap-10 items-center justify-center">
      <motion.div
        className="flex-1 px-8"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">How to get back to natural life after treated from mental health medicare</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {advs.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white rounded-xl shadow p-3">
              <span>{item.icon}</span>
              <span className="text-gray-700">{item.text}</span>
            </div>
          ))}
        </div>
        <Link href="/auth/signup" className="bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-teal-700 transition shadow">
          Sign Up
        </Link>
      </motion.div>
      <motion.div
        className="flex-1 flex justify-center relative min-h-[300px] w-full md:max-w-md"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Image
          src="https://i.postimg.cc/1X44fx8z/advantage-image.jpg"
          alt="Recovery"
          fill
          sizes="(max-width: 768px) 80vw, 400px"
          className="rounded-3xl object-cover shadow-lg"
        />
      </motion.div>
    </section>
  );
}
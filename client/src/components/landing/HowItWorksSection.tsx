'use client';
import Image from "next/image";
import Link from "next/link";
import { Search, CalendarClock, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Search Therapist",
    description: "Find a provider who’s right for you, your insurance, and specialty in the areas you want to focus on.",
    icon: <Search className="w-8 h-8 text-purple-400 mb-2" />,
    image: "/works-1.jpg"
  },
  {
    title: "Schedule Time",
    description: "Schedule live directly into your therapist’s calendar. Most are available for appointments.",
    icon: <CalendarClock className="w-8 h-8 text-pink-400 mb-2" />,
    image: "/works-2.jpg"
  },
  {
    title: "Start Therapy",
    description: "You can meet your provider in person or virtually, whichever works best for you.",
    icon: <HeartHandshake className="w-8 h-8 text-teal-400 mb-2" />,
    image: "/works-3.jpg"
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full py-16 px-0 bg-gradient-to-br from-teal-700 to-teal-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-8 text-center">How Clivo Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center bg-teal-600 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {step.icon}
              <div className="relative w-24 h-24 mb-4">
                <Image src={step.image} alt={step.title} fill sizes="96px" className="rounded-lg object-cover" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{`${i + 1}. ${step.title}`}</h3>
              <p className="text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/counselors" className="bg-white text-teal-700 font-semibold px-6 py-2 rounded-lg hover:bg-teal-100 shadow">
            Explore Our Service
          </Link>
        </div>
      </div>
    </section>
  );
}
'use client';
import Image from "next/image";
import Link from "next/link";
import { Search, Smile, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Browse Motivational Posts",
    description: "Discover uplifting stories and daily encouragement from the community.",
    icon: <Search className="w-8 h-8 text-purple-400 mb-2" />,
    image: "https://i.postimg.cc/K87ccc0N/works-1.jpg"
  },
  {
    title: "Share Anonymously",
    description: "Post your own thoughts, feelings, or motivational quotes—no names, no pressure.",
    icon: <Smile className="w-8 h-8 text-pink-400 mb-2" />,
    image: "https://i.postimg.cc/65v5SfRF/works-2.jpg"
  },
  {
    title: "Get Encouragement",
    description: "Receive emotional support and positivity from a caring, judgment-free community.",
    icon: <HeartHandshake className="w-8 h-8 text-teal-400 mb-2" />,
    image: "https://i.postimg.cc/N0pgTJq2/works-3.jpg"
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full py-12 sm:py-16 px-0 bg-gradient-to-br from-teal-700 to-teal-500 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">How Clivo Works</h2>
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
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
                <Image src={step.image} alt={step.title} fill sizes="96px" className="rounded-lg object-cover" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{`${i + 1}. ${step.title}`}</h3>
              <p className="text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link href="/auth/signup" className="bg-white text-teal-700 font-semibold px-6 py-2 rounded-lg hover:bg-teal-100 shadow">
            Join the Community
          </Link>
        </div>
      </div>
    </section>
  );
}
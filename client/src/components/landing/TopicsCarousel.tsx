'use client';
import Image from "next/image";
import Link from "next/link";
import { Brain, Frown, Meh, Smile } from "lucide-react";
import { motion } from "framer-motion";

const topics = [
  {
    title: "Personality Disorders",
    description: "Personality disorders are a group of mental health conditions.",
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    image: "/topic-1.jpg"
  },
  {
    title: "Depression",
    description: "Depression is a common and serious illness that negatively affects how you feel.",
    icon: <Frown className="w-6 h-6 text-blue-500" />,
    image: "/topic-2.jpg"
  },
  {
    title: "Anxiety",
    description: "Anxiety is a feeling of fear, dread, and uneasiness.",
    icon: <Meh className="w-6 h-6 text-indigo-500" />,
    image: "/topic-3.jpg"
  },
  {
    title: "Mood Swings",
    description: "Mood swings are sudden changes in emotional state.",
    icon: <Smile className="w-6 h-6 text-pink-500" />,
    image: "/topic-4.jpg"
  },
];

export default function TopicsCarousel() {
  return (
    <section className="w-full py-14 px-0 bg-gradient-to-br from-white via-teal-50 to-blue-50">
      <h2 className="text-xl font-bold mb-8 text-gray-900 text-center">Find providers who can help with these topics</h2>
      <div className="max-w-7xl mx-auto flex gap-8 overflow-x-auto pb-4 px-4">
        {topics.map((t, i) => (
          <motion.div
            key={i}
            className="min-w-[240px] bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-l-4 border-teal-400"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="bg-teal-100 rounded-full p-3 mb-2">{t.icon}</div>
            <div className="relative w-24 h-24 mb-4">
              <Image src={t.image} alt={t.title} fill sizes="96px" className="rounded-lg object-cover" />
            </div>
            <h3 className="font-semibold text-black text-md mb-2">{t.title}</h3>
            <p className="text-xs text-gray-700 mb-2">{t.description}</p>
            <Link href="/counselors" className="text-teal-600 font-bold text-sm hover:underline">
              Learn More
            </Link>
          </motion.div>
        ))}
        <div className="min-w-[140px] flex items-center justify-center">
          <Link href="/counselors" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 shadow">
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
}
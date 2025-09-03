'use client';
import Image from "next/image";
import Link from "next/link";
import { Users, HeartHandshake, Home, Smile } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Individual Counseling",
    description: "Personalized support for your unique journey.",
    icon: <Users className="w-7 h-7 text-teal-500" />,
    image: "/service-1.jpg",
  },
  {
    title: "Couple Counseling",
    description: "Grow together with relationship counseling.",
    icon: <HeartHandshake className="w-7 h-7 text-pink-500" />,
    image: "/service-2.jpg",
  },
  {
    title: "Family Counseling",
    description: "Support for families of all shapes and sizes.",
    icon: <Home className="w-7 h-7 text-orange-500" />,
    image: "/service-3.jpg",
  },
  {
    title: "Teens Counseling",
    description: "Specialized care for ages 13-19.",
    icon: <Smile className="w-7 h-7 text-indigo-500" />,
    image: "/service-4.jpg",
  },
];

export default function ServiceCards() {
  return (
    <section className="w-full px-0 py-16 bg-gradient-to-br from-white via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
        {services.map((s, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center h-full border-t-4 border-teal-400 hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="bg-teal-100 rounded-full p-3 mb-4">{s.icon}</div>
            <div className="relative w-20 h-20 mb-4 rounded-xl overflow-hidden">
              <Image src={s.image} alt={s.title} fill sizes="80px" className="object-cover" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-gray-900">{s.title}</h3>
            <p className="text-gray-700 mb-4">{s.description}</p>
            <Link href="/auth/signup" className="mt-auto bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">
              Try Now
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
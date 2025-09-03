'use client';
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section className="w-full px-0 py-16 bg-gradient-to-r from-teal-50 via-white to-blue-50 flex flex-col md:flex-row gap-10 items-center justify-center">
      <motion.div
        className="flex-1 px-8"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="mb-8 border-l-4 border-teal-400 pl-6">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">We care for you, we write for you</h2>
          <p className="mb-6 text-gray-700 text-lg">
            Clivo is a growing community working towards mental and emotional strength. Find motivation, connect, and seek professional help from licensed counselors.
          </p>
          <ul className="mb-4 space-y-3">
            <li className="flex items-center gap-3 text-teal-700">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              Affordable sessions
            </li>
            <li className="flex items-center gap-3 text-teal-700">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              Simple search process
            </li>
            <li className="flex items-center gap-3 text-teal-700">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              High-quality care
            </li>
          </ul>
        </div>
      </motion.div>
      <motion.div
        className="flex-1 flex justify-center relative min-h-[300px] w-full md:max-w-md"
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Image
          src="/about-image.jpg"
          alt="Therapy chairs"
          fill
          sizes="(max-width: 768px) 80vw, 400px"
          className="rounded-3xl object-cover shadow-lg"
        />
      </motion.div>
    </section>
  );
}
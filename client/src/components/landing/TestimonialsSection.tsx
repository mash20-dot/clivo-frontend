'use client';
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "James Williams",
    feedback: "This is simply unbelievable! Without it, we could have never gotten help so fast.",
    date: "08 September 2025"
  },
  {
    name: "John Willson",
    feedback: "No matter where you go, it’s the coolest, most helpful app I’ve ever used.",
    date: "04 March 2025"
  },
  {
    name: "Helen Johnson",
    feedback: "It’s incredible. It’s as if it was made for me. My mind is so much clearer now.",
    date: "01 August 2025"
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-14 px-0 bg-gradient-to-br from-white via-teal-50 to-blue-50">
      <h2 className="text-xl font-bold mb-8 text-gray-900 text-center">Love from patients who received Clivo’s best service</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border-l-4 border-teal-400"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Quote className="w-6 h-6 text-teal-500 mb-2" />
            <p className="text-gray-700 italic mb-4">“{t.feedback}”</p>
            <span className="font-semibold text-teal-700">{t.name}</span>
            <span className="text-xs text-gray-500 mt-1">{t.date}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
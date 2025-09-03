'use client';
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const motivationalQuotes = [
  {
    name: "James Williams",
    quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    date: "08 September 2025"
  },
  {
    name: "Helen Johnson",
    quote: "Every morning brings new opportunities. Embrace them and believe in your dreams.",
    date: "01 August 2025"
  },
  {
    name: "John Willson",
    quote: "You are capable of amazing things. Never let self-doubt hold you back.",
    date: "04 March 2025"
  },
  {
    name: "David O'Neal",
    quote: "The secret of getting ahead is getting started.",
    date: "15 May 2025"
  },
  {
    name: "Sarah Ahmed",
    quote: "Small steps every day lead to big changes. Keep moving forward.",
    date: "22 June 2025"
  },
  {
    name: "Emily Carter",
    quote: "Your mindset is your most powerful tool. Use it to build a life you love.",
    date: "30 July 2025"
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full py-14 px-0 bg-gradient-to-br from-white via-teal-50 to-blue-50">
      <h2 className="text-xl font-bold mb-8 text-gray-900 text-center">Motivational Quotes from the Community Members</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {motivationalQuotes.map((m, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center border-l-4 border-teal-400"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Quote className="w-6 h-6 text-teal-500 mb-2" />
            <p className="text-gray-700 italic mb-4">“{m.quote}”</p>
            <span className="font-semibold text-teal-700">{m.name}</span>
            <span className="text-xs text-gray-500 mt-1">{m.date}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
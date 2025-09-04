"use client";

import { Quote } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/landing/Footer";

const quotes = [
  {
    id: 1,
    text: "You don’t have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
    tag: "Mindfulness",
    bg: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay",
    tag: "Healing",
    bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    text: "Sometimes the people around you won’t understand your journey. They don’t need to, it’s not for them.",
    author: "Joubert Botha",
    tag: "Self Care",
    bg: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    tag: "Motivation",
    bg: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    text: "Give yourself the same care and attention that you give to others and watch yourself bloom.",
    author: "Unknown",
    tag: "Self Care",
    bg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    text: "It’s okay to not be okay. Just don’t give up.",
    author: "Unknown",
    tag: "Support",
    bg: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    text: "Your present circumstances don’t determine where you go; they merely determine where you start.",
    author: "Nido Qubein",
    tag: "Growth",
    bg: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    text: "You are not your illness. You have an individual story to tell.",
    author: "Julian Seifter",
    tag: "Identity",
    bg: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    text: "Mental health…is not a destination, but a process. It’s about how you drive, not where you’re going.",
    author: "Noam Shpancer",
    tag: "Mindfulness",
    bg: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    text: "You, yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
    tag: "Self Love",
    bg: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    text: "Every day begins with an act of courage and hope: getting out of bed.",
    author: "Mason Cooley",
    tag: "Hope",
    bg: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 12,
    text: "Sometimes self-care is exercising and eating right. Sometimes it’s spending time with loved ones. Or sometimes it’s watching an entire season of TV in one weekend.",
    author: "Nanea Hoffman",
    tag: "Self Care",
    bg: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 13,
    text: "There is hope, even when your brain tells you there isn’t.",
    author: "John Green",
    tag: "Hope",
    bg: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 14,
    text: "Promise me you’ll always remember: You’re braver than you believe, and stronger than you seem, and smarter than you think.",
    author: "Christopher Robin",
    tag: "Encouragement",
    bg: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 15,
    text: "Not until we are lost do we begin to understand ourselves.",
    author: "Henry David Thoreau",
    tag: "Discovery",
    bg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 16,
    text: "Be patient with yourself. Nothing in nature blooms all year.",
    author: "Unknown",
    tag: "Patience",
    bg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 17,
    text: "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.",
    author: "Healthy Place",
    tag: "Wellness",
    bg: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 18,
    text: "Self-care is how you take your power back.",
    author: "Lalah Delia",
    tag: "Empowerment",
    bg: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 19,
    text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush",
    tag: "Growth",
    bg: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 20,
    text: "Just when the caterpillar thought the world was over, it became a butterfly.",
    author: "Anonymous",
    tag: "Transformation",
    bg: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
  },
];

const tagColors: Record<string, string> = {
  "Mindfulness": "bg-teal-600",
  "Healing": "bg-green-600",
  "Self Care": "bg-orange-500",
  "Motivation": "bg-blue-600",
  "Support": "bg-purple-500",
  "Growth": "bg-emerald-600",
  "Identity": "bg-rose-600",
  "Self Love": "bg-pink-600",
  "Hope": "bg-cyan-600",
  "Encouragement": "bg-violet-600",
  "Discovery": "bg-yellow-600",
  "Patience": "bg-lime-600",
  "Wellness": "bg-teal-700",
  "Empowerment": "bg-indigo-600",
  "Transformation": "bg-fuchsia-600"
};

export default function QuotesPage() {
  return (
    <main className="bg-gradient-to-br from-teal-50 via-white to-blue-50 min-h-screen flex flex-col">
      <section className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="text-4xl font-extrabold text-center text-teal-700 mb-3">
          Inspiring Mental Wellness Quotes
        </h1>
        <p className="text-center text-gray-500 mb-10 text-lg max-w-2xl mx-auto">
          Empower your day with wisdom, comfort, and support. Explore our collection of uplifting and insightful quotes for your mental health journey.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotes.map((quote, i) => (
            <div
              key={quote.id}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-teal-100 overflow-hidden flex flex-col relative"
            >
              {/* Background Image */}
              <div className="relative w-full h-44">
                <Image
                  src={quote.bg}
                  alt="quote bg"
                  fill
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={i < 5}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />
                {/* Tag */}
                <span className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full shadow ${tagColors[quote.tag] || "bg-teal-600"}`}>
                  {quote.tag}
                </span>
                {/* Quote icon */}
                <Quote className="absolute bottom-4 right-4 w-8 h-8 text-white/80 drop-shadow-lg" />
              </div>
              {/* Quote Content */}
              <div className="flex flex-col flex-1 p-6 justify-between">
                <p className="text-lg font-semibold text-teal-800 mb-4">
                  “{quote.text}”
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-teal-600">{quote.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
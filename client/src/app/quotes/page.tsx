"use client";

import { useAuth } from "@/lib/UserContext";
import { useFetchMotivation, MotivationQuote } from "@/lib/mutations";
import { Quote } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/landing/Footer";
import { useMemo } from "react";

const unsplashImages = [
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
];

const tagColors: Record<string, string> = {
  Mindfulness: "bg-teal-600",
  Healing: "bg-green-600",
  "Self Care": "bg-orange-500",
  Motivation: "bg-blue-600",
  Support: "bg-purple-500",
  Growth: "bg-emerald-600",
  Identity: "bg-rose-600",
  "Self Love": "bg-pink-600",
  Hope: "bg-cyan-600",
  Encouragement: "bg-violet-600",
  Discovery: "bg-yellow-600",
  Patience: "bg-lime-600",
  Wellness: "bg-teal-700",
  Empowerment: "bg-indigo-600",
  Transformation: "bg-fuchsia-600",
};

const tags = Object.keys(tagColors);

export default function QuotesPage() {
  const { user } = useAuth();
  const token = user?.access_token;

  const { data: quotesData, isPending, isError } = useFetchMotivation(token);

  // Normalize the API response into an array
  const arr: MotivationQuote[] = useMemo(() => {
    if (!quotesData) return [];
    if (Array.isArray(quotesData)) return quotesData as MotivationQuote[];
    // If API returns .quotes or .data properties as array
    if ((quotesData as { quotes?: MotivationQuote[] }).quotes)
      return (quotesData as { quotes: MotivationQuote[] }).quotes || [];
    if ((quotesData as { data?: MotivationQuote[] }).data)
      return (quotesData as { data: MotivationQuote[] }).data || [];
    // If API returns a single object with author/message/text/quote
    if (
      typeof quotesData === "object" &&
      (quotesData as { author?: string; message?: string; text?: string; quote?: string }).author &&
      (
        (quotesData as { message?: string }).message ||
        (quotesData as { text?: string }).text ||
        (quotesData as { quote?: string }).quote
      )
    ) {
      return [quotesData as MotivationQuote];
    }
    return [];
  }, [quotesData]);

  const decoratedQuotes = useMemo(() => {
    return arr.map((quote: MotivationQuote, i: number) => ({
      text: quote.text ?? quote.message ?? quote.quote ?? "",
      author: quote.author ?? "Unknown",
      tag: tags[i % tags.length],
      bg: unsplashImages[i % unsplashImages.length],
      id: i + 1,
    }));
  }, [arr]);

  return (
    <main className="bg-gradient-to-br from-teal-50 via-white to-blue-50 min-h-screen flex flex-col">
      <section className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
        <h1 className="text-4xl font-extrabold text-center text-teal-700 mb-3">
          Inspiring Mental Wellness Quotes
        </h1>
        <p className="text-center text-gray-500 mb-10 text-lg max-w-2xl mx-auto">
          Empower your day with wisdom, comfort, and support. Explore our collection of uplifting and insightful quotes for your mental health journey.
        </p>
        {isPending ? (
          <div className="text-center text-teal-700 text-xl font-semibold pt-10">
            Loading quotes...
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 pt-10">Failed to load quotes.</div>
        ) : decoratedQuotes.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">No quotes available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {decoratedQuotes.map((quote, i) => (
              <div
                key={quote.id ?? i}
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
        )}
      </section>
      <Footer />
    </main>
  );
}
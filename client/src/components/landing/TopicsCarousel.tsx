'use client';
import Image from "next/image";
import Link from "next/link";
import { Brain, Frown, Meh, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Topics data
const topics = [
  {
    title: "Motivation",
    description: "Find daily quotes and stories to inspire a positive mindset and growth.",
    icon: <Smile className="w-6 h-6 text-pink-500" />,
    image: "https://i.postimg.cc/qRDvfm1H/topic-1.jpg"
  },
  {
    title: "Emotional Support",
    description: "Share your feelings and receive kind words from a supportive community.",
    icon: <Brain className="w-6 h-6 text-purple-500" />,
    image: "https://i.postimg.cc/76ZZWvMN/topic-2.jpg"
  },
  {
    title: "Anonymity",
    description: "Post your thoughts without revealing your identity. Clivo is a safe space.",
    icon: <Frown className="w-6 h-6 text-blue-500" />,
    image: "https://i.postimg.cc/2yq8C4tb/topic-3.jpg"
  },
  {
    title: "Community Sharing",
    description: "Connect with others who share similar experiences and support each other.",
    icon: <Meh className="w-6 h-6 text-indigo-500" />,
    image: "https://i.postimg.cc/sf8gwNBp/topic-4.jpg"
  },
];

function isMobileOrTablet() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024;
}

export default function TopicsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreen = () => setIsMobile(isMobileOrTablet());
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Auto-scroll effect for mobile/tablet
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;
    let currentIndex = 0;
    let isUserScrolling = false;

    // Detect manual scroll and pause auto-scroll for some seconds
    const onUserScroll = () => {
      isUserScrolling = true;
      setTimeout(() => { isUserScrolling = false; }, 4000);
    };
    container.addEventListener("scroll", onUserScroll);

    const scrollToCard = (idx: number) => {
      const card = container.children[idx] as HTMLElement;
      if (card) {
        container.scrollTo({
          left: card.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }
    };

    const interval = setInterval(() => {
      if (isUserScrolling) return;
      currentIndex = (currentIndex + 1) % topics.length;
      scrollToCard(currentIndex);
    }, 4000);

    // Initial scroll to first card
    scrollToCard(0);

    return () => {
      clearInterval(interval);
      container.removeEventListener("scroll", onUserScroll);
    };
  }, [isMobile]);

  return (
    <section className="w-full py-10 sm:py-14 px-0 bg-gradient-to-br from-white via-teal-50 to-blue-50">
      <h2 className="text-xl sm:text-2xl font-bold mb-8 text-gray-900 text-center">
        What You Can Experience on Clivo
      </h2>
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto flex gap-6 sm:gap-8 overflow-x-auto pb-4 px-4 scroll-smooth"
        style={{
          scrollSnapType: isMobile ? "x mandatory" : undefined,
        }}
      >
        {topics.map((t, i) => (
          <motion.div
            key={i}
            className="min-w-[220px] sm:min-w-[240px] bg-white rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center border-l-4 border-teal-400 scroll-snap-align-start"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              scrollSnapAlign: isMobile ? "start" : undefined,
            }}
          >
            <div className="bg-teal-100 rounded-full p-3 mb-2">{t.icon}</div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
              <Image src={t.image} alt={t.title} fill sizes="96px" className="rounded-lg object-cover" />
            </div>
            <h3 className="font-semibold text-black text-md mb-2">{t.title}</h3>
            <p className="text-xs text-gray-700 mb-2">{t.description}</p>
            <Link href="/auth/signup" className="text-teal-600 font-bold text-sm hover:underline">
              Join Now
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
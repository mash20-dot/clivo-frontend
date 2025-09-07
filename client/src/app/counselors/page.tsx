"use client";
import Footer from "@/components/landing/Footer";
import React, { useEffect, useState } from "react";
import { fetchCounselors } from "@/lib/api";
import { useAuth } from "@/lib/UserContext";

// Update the type to match the API response
type Counselor = {
  Full_name: string;
  email: string;
  license_number: string;
  location: string;
};

const accentColors = [
  "bg-teal-100 text-teal-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
];

const quotes = [
  "You are stronger than you think.",
  "Every day is a new beginning.",
  "Your story matters.",
  "Healing is not linear, but it is possible.",
  "Let your hope, not your hurt, shape your future.",
];

const CounselorPage: React.FC = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const token = user?.access_token;

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view counselors.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchCounselors(token)
      .then((data) => {
        // The array is in data.counselor
        const list = Array.isArray(data?.counselor) ? data.counselor : [];
        setCounselors(list);
        setError(null);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          setError("Session expired or unauthorized. Please login again.");
        } else {
          setError("Failed to load counselors.");
        }
        setCounselors([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 flex flex-col justify-between">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-10 top-24 animate-bounce-slow opacity-30 text-5xl">💬</div>
        <div className="absolute right-16 top-48 animate-bounce-slower opacity-20 text-6xl">🌱</div>
        <div className="absolute left-32 bottom-8 animate-spin-slow opacity-20 text-7xl">🌈</div>
        <div className="absolute right-10 bottom-24 animate-bounce opacity-20 text-5xl">✨</div>
      </div>

      <section className="relative z-10 max-w-7xl mx-auto w-full py-16 px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 drop-shadow-lg text-center mb-4">
          Meet Our Counselors
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center mb-8 font-medium">
          Connect with caring professionals and community supporters—here to listen, guide, and uplift you.
        </p>
        <div className="w-full flex flex-col items-center mb-12">
          <div className="rounded-xl bg-gradient-to-r from-teal-100 via-blue-100 to-purple-100 p-6 shadow-lg text-xl text-teal-800 font-semibold italic text-center max-w-2xl mx-auto animate-fade-in">
            <MotivationalQuote quotes={quotes} />
          </div>
        </div>
        {loading && (
          <div className="text-center text-teal-700 py-6 font-semibold">
            Loading counselors...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-6 font-medium">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
            {counselors.map((counselor, idx) => (
              <div
                key={counselor.email || counselor.Full_name || idx}
                className="bg-white rounded-3xl shadow-xl border border-teal-100 px-8 py-10 flex flex-col items-center hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className={`w-20 h-20 ${accentColors[idx % accentColors.length]} rounded-full mb-3 flex items-center justify-center text-3xl font-bold shadow-md`}>
                  {/* Initials from Full_name */}
                  {counselor.Full_name
                    ? counselor.Full_name.split(" ").map((n) => n[0]).join("")
                    : "C"}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-1 text-center">
                  {counselor.Full_name || "Unknown"}
                </h2>
                <span className="block font-semibold mb-1 text-center text-teal-600">
                  License: {counselor.license_number || "N/A"}
                </span>
                <span className="block text-sm text-gray-500 mb-2 text-center">
                  {counselor.location || "Ghana"}
                </span>
                <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12v1a4 4 0 01-8 0v-1M12 16v2m0 4a9 9 0 10-9-9 9 9 0 009 9z"
                    />
                  </svg>
                  <a href={`mailto:${counselor.email || ""}`} className="hover:underline">
                    {counselor.email || "info@counselors.com"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
      <style jsx>{`
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-bounce-slower {
          animation: bounce 6s infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </main>
  );
};

function MotivationalQuote({ quotes }: { quotes: string[] }) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % quotes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [quotes.length]);
  return <span>{quotes[idx]}</span>;
}

export default CounselorPage;
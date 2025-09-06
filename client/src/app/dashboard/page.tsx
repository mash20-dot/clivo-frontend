"use client";

import { useProfile, Profile } from "@/lib/userProfile";
import { useAuth } from "@/lib/UserContext";
import Image from "next/image";
import {
  Calendar,
  Notebook,
  BarChart2,
  Settings,
  LogOut,
  Home,
  User as UserIcon,
  Heart,
  Smile,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// ---- PROFILE HELPERS ----
function getFullName(profile?: Profile) {
  if (!profile) return "User";
  if (profile.role === "counselor" && profile.fullname) return profile.fullname;
  if (profile.role === "user" && (profile.firstname || profile.lastname))
    return [profile.firstname, profile.lastname].filter(Boolean).join(" ");
  return "User";
}

function getRole(profile?: Profile) {
  if (!profile?.role) return "Member";
  return profile.role === "counselor" ? "Counselor" : "User";
}

function getAvatar(profile?: Profile) {
  return (
    profile?.avatar ||
    "https://i.postimg.cc/bNj8dDst/profile-image.jpg"
  );
}

// Chart Data (keep dummy for demo)
const dummyUser = {
  moodTrends: [
    { time: "09AM", score: 2.1 },
    { time: "01PM", score: 4.9 },
    { time: "09PM", score: 3.2 },
  ],
  moodDistribution: [
    { day: 11, score: 3.2 },
    { day: 12, score: 4.75 },
    { day: 13, score: 3.9 },
    { day: 14, score: 4.1 },
    { day: 15, score: 3.5 },
  ],
  dailyInsights: {
    stress: 47,
    sleep: 75,
    focus: 82,
    avg: 20,
  },
  wellnessScore: 3.95,
  moodScore: 3.15,
};

const moodTrendData = {
  labels: dummyUser.moodTrends.map((m) => m.time),
  datasets: [
    {
      label: "Mood Score",
      data: dummyUser.moodTrends.map((m) => m.score),
      fill: false,
      borderColor: "#14b8a6",
      backgroundColor: "#14b8a6",
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: "#14b8a6",
    },
  ],
};

const moodDistributionData = {
  labels: dummyUser.moodDistribution.map((m) => m.day),
  datasets: [
    {
      label: "Mood",
      data: dummyUser.moodDistribution.map((m) => m.score),
      backgroundColor: dummyUser.moodDistribution.map((m) =>
        m.score >= 4.7 ? "#14b8a6" : "#d1f7e2"
      ),
      borderRadius: 8,
    },
  ],
};

// Sidebar links config
const sidebarLinks = [
  { label: "Home", Icon: Home },
  { label: "Calendar", Icon: Calendar },
  { label: "Journal", Icon: Notebook },
  { label: "Statistics", Icon: BarChart2 },
  { label: "Settings", Icon: Settings },
  { label: "Log Out", Icon: LogOut, isLogout: true },
];

export default function DashboardPage() {
  const { data: profile, isLoading, error } = useProfile();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Responsive Sidebar: show on mobile/tablet via Drawer/Sheet
  function handleSidebarClick(link: string, isLogout?: boolean) {
    setSidebarOpen(false);
    if (isLogout) {
      logout();
    }
    // Implement page navigation here if using a router
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      <section className="max-w-7xl w-full mx-auto flex-1 px-2 sm:px-4 py-4 sm:py-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="text-teal-700 font-bold text-lg">Loading dashboard...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="text-red-600 font-bold text-lg">
              {error instanceof Error
                ? error.message
                : "Could not load dashboard. Please try again later."}
            </span>
          </div>
        ) : (
          <>
            {/* Greetings and User Info */}
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <Image
                  src={getAvatar(profile)}
                  alt="User"
                  width={56}
                  height={56}
                  className="rounded-full border-4 border-teal-100 shadow-lg w-14 h-14 sm:w-16 sm:h-16"
                />
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-teal-700 mb-1 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                    Hello, {getFullName(profile)}!
                  </h2>
                  <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-bold">
                    {getRole(profile)}
                  </span>
                </div>
              </div>
              
              {/* Hamburger menu for mobile/tablet */}
              <div className="flex md:hidden">
                <button
                  aria-label="Open sidebar"
                  className="p-2 rounded-lg bg-white border border-teal-100 shadow-sm focus:outline-none"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6 text-teal-600" />
                </button>
              </div>

              {/* Sidebar links (hidden on mobile, shown on md+) */}
              <nav className="hidden md:flex gap-2 sm:gap-4 mt-4 md:mt-0">
                {sidebarLinks.map((link, idx) => (
                  <SidebarLink
                    key={link.label}
                    label={link.label}
                    Icon={link.Icon}
                    active={idx === 0}
                    onClick={() => handleSidebarClick(link.label, link.isLogout)}
                    isLogout={link.isLogout}
                  />
                ))}
              </nav>
            </div>

            {/* Mobile/Tablet Sidebar Drawer */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-30 bg-black/30 flex">
                <div className="w-56 max-w-[80vw] bg-white shadow-2xl p-6 flex flex-col gap-3 animate-slideInLeft">
                  <button
                    aria-label="Close sidebar"
                    className="self-end mb-2 p-2 rounded hover:bg-teal-50"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="w-5 h-5 text-teal-600" />
                  </button>
                  {sidebarLinks.map((link, idx) => (
                    <SidebarLink
                      key={link.label}
                      label={link.label}
                      Icon={link.Icon}
                      active={idx === 0}
                      onClick={() => handleSidebarClick(link.label, link.isLogout)}
                      isLogout={link.isLogout}
                      mobile
                    />
                  ))}
                </div>
                {/* Click-away area */}
                <div className="flex-1" onClick={() => setSidebarOpen(false)} />
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {/* Daily Insights */}
              <DashboardCard>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700">Daily Insights</span>
                  <span className="ml-auto text-xs text-gray-400">Today</span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-sm text-gray-600">Stress Level</span>
                    <span className="ml-auto font-bold text-pink-500">{dummyUser.dailyInsights.stress ?? "--"}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Sleep Quality</span>
                    <span className="ml-auto font-bold text-yellow-500">{dummyUser.dailyInsights.sleep ?? "--"}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Focus Level</span>
                    <span className="ml-auto font-bold text-purple-600">{dummyUser.dailyInsights.focus ?? "--"}%</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-gray-400">Average</span>
                  <span className="font-bold text-teal-700">{dummyUser.dailyInsights.avg ?? "--"}%</span>
                </div>
              </DashboardCard>

              {/* Emotional Landscape */}
              <DashboardCard>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700">Emotional Landscape</span>
                  <span className="ml-auto text-xs text-gray-400">01/2025</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full h-32 flex items-center justify-center">
                    <Line
                      data={{
                        labels: ["Mon", "Tue", "Wed"],
                        datasets: [
                          {
                            label: "Emotions",
                            data: [3, 4.5, 2.8],
                            borderColor: "#14b8a6",
                            backgroundColor: "#d1f7e2",
                            tension: 0.5,
                            fill: false,
                            pointRadius: 5,
                            pointBackgroundColor: "#14b8a6",
                          },
                        ],
                      }}
                      options={{
                        plugins: { legend: { display: false } },
                        scales: { x: { display: false }, y: { display: false } },
                      }}
                    />
                  </div>
                </div>
                <button className="mt-6 px-4 py-2 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition">
                  Weekly Mood Report
                </button>
              </DashboardCard>

              {/* Wellness Summary */}
              <DashboardCard>
                <div className="flex items-center gap-2 mb-4">
                  <Smile className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700">Wellness Summary</span>
                  <span className="ml-auto text-xs text-gray-400">This Week</span>
                </div>
                <div className="flex gap-3 mt-4">
                  {["Mon", "Tue", "Wed"].map((day, idx) => (
                    <div
                      key={day}
                      className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg ${
                        idx === 2 ? "bg-teal-600 text-white" : "text-teal-700"
                      }`}
                    >
                      <span className="font-bold">{day}</span>
                      <span className="text-xs mt-1">•••</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-3xl font-bold text-teal-700">
                  {dummyUser.wellnessScore ?? "--"}
                </div>
                <div className="text-sm text-gray-400 mb-2">Average wellness score</div>
              </DashboardCard>

              {/* Mood Distribution */}
              <DashboardCard>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700">Mood Distribution</span>
                </div>
                <div className="w-full h-32 flex items-center mt-3">
                  <Bar
                    data={moodDistributionData}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                  />
                </div>
                <div className="mt-3 text-xl font-bold text-teal-700">{dummyUser.moodDistribution[1]?.score ?? "--"}</div>
              </DashboardCard>

              {/* Mindful Relaxation */}
              <DashboardCard>
                <div className="flex items-center gap-2 mb-4">
                  <Smile className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700">Mindful Relaxation</span>
                </div>
                <div className="mt-3 flex items-center justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=200&q=80"
                    alt="Relaxation"
                    width={120}
                    height={80}
                    className="rounded-xl shadow-lg"
                  />
                </div>
                <button className="mt-6 px-4 py-2 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition">
                  Relaxation Therapy
                </button>
              </DashboardCard>

              {/* Daily Mood Trends */}
              <DashboardCard>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-teal-700">Daily Mood Trends</span>
                </div>
                <div className="w-full h-32 flex items-center mt-3">
                  <Line
                    data={moodTrendData}
                    options={{
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    }}
                  />
                </div>
                <div className="mt-3 text-xl font-bold text-teal-700">
                  {dummyUser.moodScore ?? "--"}
                </div>
                <div className="text-sm text-gray-400 mb-2">Average mood score</div>
              </DashboardCard>
            </div>
          </>
        )}
      </section>
      {/* Mobile sidebar slide-in animation */}
      <style jsx global>{`
        @keyframes slideInLeft {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.2s ease;
        }
      `}</style>
    </main>
  );
}

// SidebarLink: responsive, highlights logout, disables hover color for logout
function SidebarLink({
  label,
  Icon,
  active = false,
  onClick,
  isLogout,
  mobile = false,
}: {
  label: string;
  Icon: React.ElementType;
  active?: boolean;
  onClick?: () => void;
  isLogout?: boolean;
  mobile?: boolean;
}) {
  const color =
    isLogout
      ? "bg-red-50 text-red-600 hover:bg-red-100"
      : active
        ? "bg-teal-100 text-teal-700"
        : "text-gray-500 hover:bg-teal-50 hover:text-teal-600";
  // For mobile, make items larger and full width
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${color} ${mobile ? "w-full justify-start" : ""}`}
      type="button"
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function DashboardCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-teal-100 flex flex-col h-full min-h-[220px]">
      {children}
    </div>
  );
}
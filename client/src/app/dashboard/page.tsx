"use client";

import { useState } from "react";
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

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

// Type Definitions
type User = {
  name: string;
  role: "User";
  avatar: string;
  wellnessScore: number;
  moodScore: number;
  moodTrends: { time: string; score: number }[];
  moodDistribution: { day: number; score: number }[];
  dailyInsights: {
    stress: number;
    sleep: number;
    focus: number;
    avg: number;
  };
};

type Counselor = {
  name: string;
  role: "Counselor";
  avatar: string;
  clientsHelped: number;
  sessionsThisWeek: number;
  avgClientScore: number;
  upcomingSessions: { day: string; sessions: number }[];
  feedback: { client: string; score: number }[];
};

type Person = User | Counselor;

// Dummy user and counselor data (same as before)
const dummyUser: User = {
  name: "Esther Johnson",
  role: "User",
  avatar: "https://i.postimg.cc/sgt6J1gK/profile-image.jpg",
  wellnessScore: 3.95,
  moodScore: 3.15,
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
};

const dummyCounselor: Counselor = {
  name: "Dr. John Smith",
  role: "Counselor",
  avatar: "https://i.postimg.cc/sgt6J1gK/profile-image.jpg",
  clientsHelped: 82,
  sessionsThisWeek: 12,
  avgClientScore: 4.3,
  upcomingSessions: [
    { day: "Mon", sessions: 3 },
    { day: "Tue", sessions: 4 },
    { day: "Wed", sessions: 5 },
  ],
  feedback: [
    { client: "Sarah", score: 4.8 },
    { client: "James", score: 4.5 },
    { client: "Lisa", score: 4.6 },
  ],
};

// Toggle demo between user/counselor
const isCounselor = false;
const user: Person = isCounselor ? dummyCounselor : dummyUser;

// Accent color
const accent = "bg-teal-600 text-white";

// Chart Data
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

// Type guards
function isUser(person: Person): person is User {
  return person.role === "User";
}

function isCounselorType(person: Person): person is Counselor {
  return person.role === "Counselor";
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col">
      <section className="max-w-7xl w-full mx-auto flex-1 px-4 py-8">
        {/* Greetings and User Info */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Image
              src={user.avatar}
              alt="User"
              width={64}
              height={64}
              className="rounded-full border-4 border-teal-100 shadow-lg"
            />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-1 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-teal-600" />
                Hello, {user.name}!
              </h2>
              <span className="text-sm px-2 py-1 rounded-full bg-teal-100 text-teal-700 font-bold">
                {user.role}
              </span>
            </div>
          </div>
          <div className="md:ml-auto flex gap-4 mt-4 md:mt-0">
            <SidebarLink label="Home" Icon={Home} active />
            <SidebarLink label="Calendar" Icon={Calendar} />
            <SidebarLink label="Journal" Icon={Notebook} />
            <SidebarLink label="Statistics" Icon={BarChart2} />
            <SidebarLink label="Settings" Icon={Settings} />
            <SidebarLink label="Log Out" Icon={LogOut} />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Daily Insights */}
          {isUser(user) && (
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
                  <span className="ml-auto font-bold text-pink-500">{user.dailyInsights.stress ?? "--"}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Sleep Quality</span>
                  <span className="ml-auto font-bold text-yellow-500">{user.dailyInsights.sleep ?? "--"}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Focus Level</span>
                  <span className="ml-auto font-bold text-purple-600">{user.dailyInsights.focus ?? "--"}%</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-400">Average</span>
                <span className="font-bold text-teal-700">{user.dailyInsights.avg ?? "--"}%</span>
              </div>
            </DashboardCard>
          )}

          {/* Emotional Landscape */}
          <DashboardCard>
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-teal-700">Emotional Landscape</span>
              <span className="ml-auto text-xs text-gray-400">01/2025</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              {/* Placeholder for graph */}
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
              {isUser(user) ? user.wellnessScore ?? "--" : "--"}
            </div>
            <div className="text-sm text-gray-400 mb-2">Average wellness score</div>
          </DashboardCard>

          {/* Mood Distribution */}
          {isUser(user) && (
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
          )}

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
              {isUser(user) ? user.moodScore ?? "--" : "--"}
            </div>
            <div className="text-sm text-gray-400 mb-2">Average mood score</div>
          </DashboardCard>
        </div>

        {/* Extra details for counselors */}
        {isCounselorType(user) && (
          <div className="mt-12">
            <h2 className="text-lg text-teal-700 font-bold mb-4">Your Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <DashboardCard>
                <span className="font-semibold text-teal-700 mb-2">Clients Helped</span>
                <div className="mt-5 text-4xl font-bold text-teal-600">{user.clientsHelped}</div>
              </DashboardCard>
              <DashboardCard>
                <span className="font-semibold text-teal-700 mb-2">Sessions This Week</span>
                <div className="mt-5 text-4xl font-bold text-teal-600">{user.sessionsThisWeek}</div>
              </DashboardCard>
              <DashboardCard>
                <span className="font-semibold text-teal-700 mb-2">Avg. Client Score</span>
                <div className="mt-5 text-4xl font-bold text-teal-600">{user.avgClientScore}</div>
              </DashboardCard>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

// ... SidebarLink and DashboardCard remain unchanged
function SidebarLink({
  label,
  Icon,
  active = false,
}: {
  label: string;
  Icon: React.ElementType;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
        active
          ? "bg-teal-100 text-teal-700"
          : "text-gray-500 hover:bg-teal-50 hover:text-teal-600"
      }`}
      type="button"
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function DashboardCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-teal-100 flex flex-col h-full min-h-[220px]">
      {children}
    </div>
  );
}
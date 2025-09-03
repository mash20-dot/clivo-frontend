import "@/styles/globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "Clivo",
  description: "Motivation, community, and professional guidance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
          <main className="w-full min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
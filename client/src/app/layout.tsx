import "@/styles/globals.css";
import { ReactNode } from "react";
import Providers from "./providers";
import Navbar from "@/components/navbar";
import Script from "next/script";

export const metadata = {
  title: "Clivo",
  description: "Motivation, community, and professional guidance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BCCP7V5SF5"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BCCP7V5SF5');
          `}
        </Script>
      </head>
      <body className="min-h-screen w-full bg-gray-50 text-gray-900">
        <Providers>
          <Navbar />
          <main className="w-full min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

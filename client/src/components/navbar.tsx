"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function Navbar() {
  const { data: session } = useSession();
  const isAuthed = !!session?.user;

  // State for scroll effect
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={clsx(
      "sticky top-0 z-40 border-b transition-colors duration-300 backdrop-blur",
      scrolled ? "bg-white/90" : "bg-white/60"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          className={clsx(
            "font-extrabold text-2xl tracking-tight transition-colors duration-300",
            scrolled ? "text-green-600" : "text-green-500"
          )}
        >
          Clivo
        </Link>
        {/* Centered navigation links */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-1 md:gap-2">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/posts", label: "Posts" },
              { href: "/quotes", label: "Quotes" },
              { href: "/counselors", label: "Counselors" },
              { href: "/settings", label: "Settings" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-4 py-2 rounded-md font-medium transition-all duration-200",
                  scrolled
                    ? "text-black"
                    : "text-white",
                  "hover:bg-green-500 hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        {/* Right side: login/signup or logout */}
        <div className="flex gap-2">
          {isAuthed ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-md transition-all font-semibold text-gray-600 bg-white border border-green-500 hover:bg-green-500 hover:text-white hover:border-green-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-md transition-all font-semibold text-gray-600 bg-white border border-green-500 hover:bg-green-500 hover:text-white hover:border-green-600"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-md transition-all font-semibold text-white bg-green-500 border border-green-500 hover:bg-white hover:text-green-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
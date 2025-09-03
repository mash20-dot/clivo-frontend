"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/posts", label: "Posts" },
  { href: "/quotes", label: "Quotes" },
  { href: "/counselors", label: "Counselors" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const isAuthed = !!session?.user;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      setMenuVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timeout = setTimeout(() => setMenuVisible(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timeout);
    }
  }, [mobileOpen]);

  return (
    <header className={clsx(
      "sticky top-0 z-40 border-b transition-colors duration-300 backdrop-blur",
      scrolled ? "bg-white/90" : "bg-white/60"
    )}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:py-4 relative">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center flex-shrink-0 h-10 md:h-12"
          onClick={() => setMobileOpen(false)}
        >
          {/* Updated logo size: smaller, fits navbar better */}
          <Image
            src="https://i.postimg.cc/9FyWsVzP/clivo-png-1.png"
            alt="Clivo Logo"
            width={90}
            height={32}
            className="object-contain h-8 w-auto md:h-10"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex gap-1 md:gap-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-4 py-2 rounded-md font-medium transition-all duration-200",
                  scrolled ? "text-black" : "text-white",
                  "hover:bg-teal-700 hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-2">
          {isAuthed ? (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-md transition-all font-semibold text-gray-600 bg-white border border-teal-600 hover:bg-teal-700 hover:text-white hover:border-green-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-md transition-all font-semibold text-gray-600 bg-white border border-teal-600 hover:bg-teal-700 hover:text-white hover:border-green-600"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-md transition-all font-semibold text-white bg-teal-700 border border-teal-600 hover:bg-white hover:text-teal-600"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Icon */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span
            className={clsx(
              "transition-transform duration-300",
              mobileOpen ? "scale-90 opacity-0 rotate-45 absolute" : "scale-100 opacity-100"
            )}
          >
            <Menu className="w-7 h-7 text-teal-600" />
          </span>
          <span
            className={clsx(
              "transition-transform duration-300 absolute",
              mobileOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}
          >
            <X className="w-7 h-7 text-teal-600" />
          </span>
        </button>

        {/* Overlay */}
        <div
          className={clsx(
            "fixed inset-0 z-40 transition-opacity duration-300 md:hidden",
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          style={{
            background: mobileOpen ? "white" : "transparent",
          }}
          onClick={() => setMobileOpen(false)}
        />

        {/* Mobile Menu Drawer with no top space */}
        {menuVisible && (
          <nav
            className={clsx(
              "fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 md:hidden",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
            aria-label="Mobile menu"
          >
            <div className={clsx(
              "flex items-center justify-between px-6 h-[56px] border-b",
              "transition-all duration-300",
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            )}>
              <Link
                href="/"
                className="flex items-center flex-shrink-0 h-10"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="https://i.postimg.cc/9FyWsVzP/clivo-png-1.png"
                  alt="Clivo Logo"
                  width={90}
                  height={32}
                  className="object-contain h-8 w-auto md:h-10"
                  priority
                />
              </Link>
              <button
                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-7 h-7 text-teal-600" />
              </button>
            </div>
            <div className={clsx(
              "flex flex-col gap-2 px-6 py-6 flex-1 bg-white transition-all duration-300 delay-100",
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            )}>
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block px-4 py-3 rounded-md text-teal-600 font-semibold text-lg transition hover:bg-green-50 hover:text-teal-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className={clsx(
              "flex flex-col gap-2 px-6 pb-6 bg-white transition-all duration-300 delay-150",
              mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            )}>
              {isAuthed ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-md transition-all font-semibold text-teal-600 bg-white border border-teal-500 hover:bg-teal-500 hover:text-white hover:border-teal-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="w-full px-4 py-3 rounded-md transition-all font-semibold text-teal-600 bg-white border border-teal-500 hover:bg-teal-500 hover:text-white hover:border-teal-600 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="w-full px-4 py-3 rounded-md transition-all font-semibold text-white bg-teal-500 border border-teal-500 hover:bg-white hover:text-teal-600 text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </nav>
    </header>
  );
}
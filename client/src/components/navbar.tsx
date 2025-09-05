"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ChevronDown, User as UserIcon } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { useAuth } from "@/lib/UserContext";

// Helper for avatar initial
function getInitial(
  user: { username?: string; firstname?: string; email?: string } | null
): string {
  if (user?.username) return user.username[0]?.toUpperCase();
  if (user?.firstname) return user.firstname[0]?.toUpperCase();
  if (user?.email) return user.email[0]?.toUpperCase();
  return "U";
}
const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/posts", label: "Posts" },
  { href: "/quotes", label: "Quotes" },
  { href: "/counselors", label: "Counselors" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const isAuthed = !!user;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // Profile dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  // Avatar with dropdown
  const AvatarSection = (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setShowDropdown((v) => !v)}
        aria-label="Open profile menu"
      >
        <div className="bg-teal-700 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg shadow">
          {getInitial(user)}
        </div>
        <ChevronDown className="text-teal-700 w-4 h-4" />
      </button>
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[160px]">
          <Link
            href="/profile" // you can change this later!
            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-teal-50 transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            <UserIcon className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={() => {
              logout();
              setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-3 text-teal-700 font-semibold hover:bg-teal-50 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 border-b transition-colors duration-300 backdrop-blur",
        scrolled ? "bg-white/90" : "bg-white/60"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:py-4 relative">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center flex-shrink-0 h-10 md:h-12"
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

        {/* Desktop Auth Buttons or Avatar */}
        <div className="hidden md:flex gap-2 items-center">
          {isAuthed ? (
            AvatarSection
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
              mobileOpen
                ? "scale-90 opacity-0 rotate-45 absolute"
                : "scale-100 opacity-100"
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
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
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
            <div
              className={clsx(
                "flex items-center justify-between px-6 h-[56px] border-b",
                "transition-all duration-300",
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8"
              )}
            >
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
            <div
              className={clsx(
                "flex flex-col gap-2 px-6 py-6 flex-1 bg-white transition-all duration-300 delay-100",
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8"
              )}
            >
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
            <div
              className={clsx(
                "flex flex-col gap-2 px-6 pb-6 bg-white transition-all duration-300 delay-150",
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-8"
              )}
            >
              {isAuthed ? (
                <div className="flex items-center gap-2 w-full">
                  <div className="bg-teal-700 text-white rounded-full w-9 h-9 flex items-center justify-center font-bold text-lg shadow">
                    {getInitial(user)}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-md transition-all font-semibold text-teal-600 bg-white border border-teal-500 hover:bg-teal-500 hover:text-white hover:border-teal-600"
                  >
                    Logout
                  </button>
                </div>
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
import Link from "next/link";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-teal-900 text-teal-100 py-10 sm:py-12 px-0 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
        <div>
          <h3 className="text-lg font-bold mb-2">Clivo</h3>
          <p className="text-sm mb-2">
            © {new Date().getFullYear()} Clivo. All rights reserved.
          </p>
          <div className="flex gap-3 mt-2">
            <Link href="#" className="hover:text-yellow-300" aria-label="Instagram"><Instagram /></Link>
            <Link href="#" className="hover:text-yellow-300" aria-label="Twitter"><Twitter /></Link>
            <Link href="#" className="hover:text-yellow-300" aria-label="LinkedIn"><Linkedin /></Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Get Started</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/auth/signup" className="hover:underline">Sign Up</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Features</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/dashboard" className="hover:underline">Motivational Posts</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Anonymity</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Community Support</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Daily Quotes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Useful Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms of Use</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/emergency" className="hover:underline">Emergency Resources</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
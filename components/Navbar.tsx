import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="font-bold text-xl text-slate-900">BlueStock</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition">
              Browse IPOs
            </Link>
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition">
              Dashboard
            </Link>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition">
              About
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition">
              Contact
            </a>
          </div>

          {/* Auth Links */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-slate-600 hover:text-slate-900 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  className="px-4 py-2 text-teal-600 hover:text-teal-700 font-medium transition"
                >
                  Admin
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              Browse IPOs
            </Link>
            <Link href="/" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              Dashboard
            </Link>
            <a href="#" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              About
            </a>
            <a href="#" className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">
              Contact
            </a>
            {!session && (
              <Link href="/admin/login" className="block px-4 py-2 text-teal-600 font-medium">
                Admin Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

import { useState } from "react";
import Link from "next/link";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add email subscription logic
    setSubscribed(true);
    setTimeout(() => setEmail(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-400">BlueStock IPO</h1>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition"
            >
              Browse IPOs
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Track IPOs{" "}
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Intelligently
            </span>
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Get real-time IPO updates, analyze performance metrics, and make
            informed investment decisions. All in one platform.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Link
              href="/"
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
            >
              Explore IPOs →
            </Link>
            <Link
              href="#features"
              className="px-8 py-4 border border-slate-400 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-16">
            <div>
              <p className="text-4xl font-bold text-teal-400">50+</p>
              <p className="text-slate-400">IPOs Tracked</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400">1000+</p>
              <p className="text-slate-400">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-teal-400">24/7</p>
              <p className="text-slate-400">Real-time Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-white mb-12">
            Powerful Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Analytics Dashboard",
                desc: "Track IPO performance with detailed charts and metrics",
              },
              {
                icon: "📄",
                title: "Document Library",
                desc: "Access RHP and DRHP documents in one place",
              },
              {
                icon: "⚡",
                title: "Real-time Updates",
                desc: "Get instant notifications on IPO status changes",
              },
              {
                icon: "🔍",
                title: "Advanced Search",
                desc: "Filter and find IPOs by status, sector, and more",
              },
              {
                icon: "💼",
                title: "Admin Panel",
                desc: "Complete IPO management system for admins",
              },
              {
                icon: "🔐",
                title: "Secure & Fast",
                desc: "Enterprise-grade security with lightning speed",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-slate-900 rounded-xl border border-slate-700 hover:border-teal-500 transition"
              >
                <p className="text-4xl mb-4">{feature.icon}</p>
                <h4 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-slate-300 mb-8">
            Get notified about new IPOs and market updates
          </p>

          {subscribed ? (
            <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
              ✓ Thanks for subscribing! Check your email.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          <p>© 2026 BlueStock IPO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-xl text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

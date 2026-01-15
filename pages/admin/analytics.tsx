import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

interface DashboardStats {
  totalIPOs: number;
  upcomingIPOs: number;
  openIPOs: number;
  listedIPOs: number;
  averageListingGain: number;
  totalIssueSize: string;
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, router]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const data = await res.json();
      setStats(data.stats);
      setChartData(data.chartData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Loading analytics...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 text-sm">Track IPO performance metrics</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition"
            >
              Back to Dashboard
            </Link>
            <a
              href="/api/auth/signout"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-600 text-sm font-medium">Total IPOs</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">
              {stats?.totalIPOs || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-600 text-sm font-medium">Upcoming IPOs</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats?.upcomingIPOs || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-600 text-sm font-medium">Open IPOs</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">
              {stats?.openIPOs || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-600 text-sm font-medium">Listed IPOs</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats?.listedIPOs || 0}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-600 text-sm font-medium">
              Avg Listing Gain
            </p>
            <p
              className={`text-4xl font-bold mt-2 ${
                (stats?.averageListingGain || 0) > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stats?.averageListingGain?.toFixed(2) || 0}%
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <p className="text-slate-600 text-sm font-medium">Total Issue Size</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {stats?.totalIssueSize || "N/A"}
            </p>
          </div>
        </div>

        {/* Status Distribution Chart */}
        {chartData && (
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              IPO Status Distribution
            </h2>
            <div className="space-y-4">
              {chartData.statusBreakdown?.map(
                (item: { status: string; count: number }) => (
                  <div key={item.status}>
                    <div className="flex justify-between mb-2">
                      <p className="text-slate-700 font-medium">{item.status}</p>
                      <p className="text-slate-600">{item.count}</p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === "UPCOMING"
                            ? "bg-blue-600"
                            : item.status === "OPEN"
                            ? "bg-yellow-600"
                            : item.status === "CLOSED"
                            ? "bg-orange-600"
                            : "bg-green-600"
                        }`}
                        style={{
                          width: `${
                            ((item.count || 0) / (stats?.totalIPOs || 1)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

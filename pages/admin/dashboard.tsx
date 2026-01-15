import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const [ipos, setIpos] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchIPOs();
      fetchStats();
    }
  }, [status, router]);

  const fetchIPOs = async () => {
    try {
      const res = await fetch("/api/ipos");
      const data = await res.json();
      setIpos(data);
    } catch (error) {
      console.error("Error fetching IPOs:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const deleteIPO = async (id: number) => {
    if (!confirm("Are you sure you want to delete this IPO?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/ipos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("IPO deleted successfully");
        fetchIPOs();
        fetchStats();
      } else {
        alert("Failed to delete IPO");
      }
    } catch (error) {
      console.error("Error deleting IPO:", error);
      alert("Error deleting IPO");
    } finally {
      setDeleting(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600 text-sm">Manage IPOs and view analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700 font-medium">
              Welcome, {session?.user?.name || "Admin"}
            </span>
            <Link
              href="/admin/analytics"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
            >
              📊 Analytics
            </Link>
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/admin/login" })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <p className="text-slate-600 text-sm font-medium">Total IPOs</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {stats.totalIPOs}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <p className="text-slate-600 text-sm font-medium">Upcoming</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {stats.upcomingIPOs}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <p className="text-slate-600 text-sm font-medium">Open</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {stats.openIPOs}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <p className="text-slate-600 text-sm font-medium">Listed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {stats.listedIPOs}
              </p>
            </div>
          </div>
        )}

        {/* Add New IPO Button */}
        <button
          onClick={() => router.push("/admin/create")}
          className="mb-6 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition shadow-sm"
        >
          + Add New IPO
        </button>

        {/* IPOs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
          {ipos.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-lg mb-4">No IPOs found. Create one to get started!</p>
              <button
                onClick={() => router.push("/admin/create")}
                className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
              >
                Create First IPO
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Symbol
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Price Band
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Open Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Close Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ipos.map((ipo: any) => (
                    <tr
                      key={ipo.id}
                      className="border-t border-slate-200 hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {ipo.company?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {ipo.company?.symbol || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {ipo.priceBand}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(ipo.openDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(ipo.closeDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                            ipo.status === "UPCOMING"
                              ? "bg-blue-100 text-blue-800"
                              : ipo.status === "OPEN"
                              ? "bg-yellow-100 text-yellow-800"
                              : ipo.status === "CLOSED"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {ipo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/edit/${ipo.id}`)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteIPO(ipo.id)}
                          disabled={deleting === ipo.id}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-medium rounded transition"
                        >
                          {deleting === ipo.id ? "⏳" : "🗑️"} Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 text-center text-slate-600 text-sm">
          <p>Total IPOs Managed: {ipos.length}</p>
        </div>
      </main>
    </div>
  );
}

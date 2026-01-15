import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Company {
  id: number;
  name: string;
  symbol: string;
}

interface IPO {
  id: number;
  company: Company;
  priceBand: string;
  openDate: string;
  closeDate: string;
  issueSize: string;
  issueType: string;
  listingDate?: string;
  status: string;
  ipoPrice?: number;
  listingPrice?: number;
  listingGain?: number;
  currentMarketPrice?: number;
  currentReturn?: number;
  documents?: Array<{
    id: number;
    rhpPdf?: string;
    drhpPdf?: string;
  }>;
}

export default function IPODetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [ipo, setIpo] = useState<IPO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      fetchIPO();
    }
  }, [id]);

  const fetchIPO = async () => {
    try {
      const res = await fetch(`/api/ipos/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setIpo(data);
    } catch (error) {
      console.error("Error fetching IPO:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-600 text-lg">Loading IPO details...</p>
        </div>
      </div>
    );
  }

  if (!ipo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">❌ IPO not found</p>
          <Link
            href="/"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to IPOs
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return { bg: "bg-blue-50", text: "text-blue-800", badge: "bg-blue-100" };
      case "OPEN":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          badge: "bg-yellow-100",
        };
      case "CLOSED":
        return {
          bg: "bg-orange-50",
          text: "text-orange-800",
          badge: "bg-orange-100",
        };
      case "LISTED":
        return {
          bg: "bg-green-50",
          text: "text-green-800",
          badge: "bg-green-100",
        };
      default:
        return { bg: "bg-gray-50", text: "text-gray-800", badge: "bg-gray-100" };
    }
  };

  const getReturnColor = (value?: number) => {
    if (value === null || value === undefined) return "text-gray-600";
    return value > 0 ? "text-green-600" : value < 0 ? "text-red-600" : "text-gray-600";
  };

  const colors = getStatusColor(ipo.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-4">
            ← Back to IPOs
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 mb-8 border border-slate-200 ${colors.bg}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {ipo.company.name}
              </h1>
              <p className="text-xl text-slate-600">{ipo.company.symbol}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${colors.badge}`}>
              {ipo.status}
            </span>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 font-medium">Price Band</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {ipo.priceBand}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 font-medium">Issue Type</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {ipo.issueType}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 font-medium">Issue Size</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {ipo.issueSize}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 font-medium">Market Price</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ₹{ipo.currentMarketPrice || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-200 bg-white rounded-t-lg p-4">
          {["overview", "timeline", "returns", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition capitalize ${
                activeTab === tab
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-8 mb-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  IPO Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-teal-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">Company</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ipo.company.name}
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">Symbol</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ipo.company.symbol}
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                        {ipo.status}
                      </span>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">Issue Type</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ipo.issueType}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">Price Band</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ipo.priceBand}
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">Issue Size</p>
                      <p className="text-xl font-bold text-slate-900">
                        {ipo.issueSize}
                      </p>
                    </div>

                    <div className="border-l-4 border-indigo-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">
                        Current Market Price
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        ₹{ipo.currentMarketPrice || "N/A"}
                      </p>
                    </div>

                    <div className="border-l-4 border-pink-500 pl-4">
                      <p className="text-sm text-slate-600 mb-1">
                        Current Return
                      </p>
                      <p className={`text-xl font-bold ${getReturnColor(ipo.currentReturn)}`}>
                        {ipo.currentReturn !== null && ipo.currentReturn !== undefined
                          ? `${ipo.currentReturn > 0 ? "+" : ""}${ipo.currentReturn}%`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Timeline</h2>
              <div className="space-y-4">
                {/* Open Date */}
                <div className="flex items-start gap-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl">📅</div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 font-medium">
                      IPO Opens
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {new Date(ipo.openDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Close Date */}
                <div className="flex items-start gap-6 p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl">🔒</div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 font-medium">
                      IPO Closes
                    </p>
                    <p className="text-2xl font-bold text-slate-900">
                      {new Date(ipo.closeDate).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Listing Date */}
                {ipo.listingDate && (
                  <div className="flex items-start gap-6 p-6 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-3xl">📈</div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 font-medium">
                        Listed On
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {new Date(ipo.listingDate).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Returns Tab */}
          {activeTab === "returns" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Performance Metrics
              </h2>
              {ipo.status === "LISTED" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <p className="text-sm text-slate-600 font-medium mb-3">
                      IPO Price
                    </p>
                    <p className="text-4xl font-bold text-slate-900">
                      ₹{ipo.ipoPrice || "N/A"}
                    </p>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <p className="text-sm text-slate-600 font-medium mb-3">
                      Listing Price
                    </p>
                    <p className="text-4xl font-bold text-slate-900">
                      ₹{ipo.listingPrice || "N/A"}
                    </p>
                  </div>

                  <div className={`p-8 bg-gradient-to-br ${
                    ipo.listingGain && ipo.listingGain > 0
                      ? "from-green-50 to-green-100"
                      : "from-red-50 to-red-100"
                  } rounded-xl border ${
                    ipo.listingGain && ipo.listingGain > 0
                      ? "border-green-200"
                      : "border-red-200"
                  }`}>
                    <p className="text-sm text-slate-600 font-medium mb-3">
                      Listing Gain
                    </p>
                    <p className={`text-4xl font-bold ${getReturnColor(ipo.listingGain)}`}>
                      {ipo.listingGain !== null && ipo.listingGain !== undefined
                        ? `${ipo.listingGain > 0 ? "+" : ""}${ipo.listingGain}%`
                        : "N/A"}
                    </p>
                  </div>

                  <div className={`p-8 bg-gradient-to-br ${
                    ipo.currentReturn && ipo.currentReturn > 0
                      ? "from-green-50 to-green-100"
                      : "from-red-50 to-red-100"
                  } rounded-xl border ${
                    ipo.currentReturn && ipo.currentReturn > 0
                      ? "border-green-200"
                      : "border-red-200"
                  }`}>
                    <p className="text-sm text-slate-600 font-medium mb-3">
                      Current Return
                    </p>
                    <p className={`text-4xl font-bold ${getReturnColor(ipo.currentReturn)}`}>
                      {ipo.currentReturn !== null && ipo.currentReturn !== undefined
                        ? `${ipo.currentReturn > 0 ? "+" : ""}${ipo.currentReturn}%`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-100 rounded-lg text-center">
                  <p className="text-slate-600 text-lg">
                    📊 Performance metrics will be available after listing
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Official Documents
              </h2>
              {ipo.documents && ipo.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ipo.documents[0]?.rhpPdf && (
                    <a
                      href={ipo.documents[0].rhpPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition"
                    >
                      <div className="text-5xl mb-4">📄</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        RHP (Red Herring Prospectus)
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        Initial prospectus filed with the stock exchange
                      </p>
                      <div className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                        Download PDF →
                      </div>
                    </a>
                  )}

                  {ipo.documents[0]?.drhpPdf && (
                    <a
                      href={ipo.documents[0].drhpPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition"
                    >
                      <div className="text-5xl mb-4">📋</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        DRHP (Draft Red Herring Prospectus)
                      </h3>
                      <p className="text-slate-600 text-sm mb-4">
                        Draft prospectus with detailed company information
                      </p>
                      <div className="inline-flex items-center text-green-600 font-semibold hover:text-green-700">
                        Download PDF →
                      </div>
                    </a>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-slate-100 rounded-lg text-center">
                  <p className="text-slate-600 text-lg">
                    📄 No documents available for this IPO yet
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition shadow-md">
            💾 Save IPO
          </button>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-md">
            📊 Add to Watchlist
          </button>
          <button className="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-semibold transition">
            🔔 Set Reminder
          </button>
        </div>
      </main>
    </div>
  );
}

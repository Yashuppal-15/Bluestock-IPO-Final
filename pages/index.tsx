import { useEffect, useState } from "react";
import Link from "next/link";

interface Company {
  id: number;
  name: string;
  symbol: string;
}

interface Document {
  id: number;
  rhpPdf?: string;
  drhpPdf?: string;
}

interface IPO {
  id: number;
  company: Company;
  priceBand: string;
  openDate: string;
  closeDate: string;
  issueSize: string;
  issueType: string;
  status: string;
  listingGain?: number;
  currentReturn?: number;
  listingPrice?: number;
  ipoPrice?: number;
  currentMarketPrice?: number;
  documents: Document[];
}

export default function HomePage() {
  const [ipos, setIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchIPOs();
  }, []);

  const fetchIPOs = async () => {
    try {
      const res = await fetch("/api/ipos");
      const data = await res.json();
      setIpos(data);
    } catch (error) {
      console.error("Error fetching IPOs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIPOs = ipos.filter((ipo) => {
    if (filter === "ALL") return true;
    return ipo.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-blue-100 text-blue-800";
      case "OPEN":
        return "bg-yellow-100 text-yellow-800";
      case "CLOSED":
        return "bg-orange-100 text-orange-800";
      case "LISTED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReturnColor = (value?: number) => {
    if (!value) return "text-gray-600";
    return value > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">BlueStock IPO</h1>
            <p className="text-slate-600 text-sm">Track and analyze IPO opportunities</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition font-medium"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Buttons */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {["ALL", "UPCOMING", "OPEN", "CLOSED", "LISTED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-teal-600 hover:text-teal-600"
                }`}
              >
                {status}
                <span className="ml-2 text-sm opacity-75">
                  ({ipos.filter((ipo) => (status === "ALL" ? true : ipo.status === status)).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-slate-600 mt-2">Loading IPOs...</p>
          </div>
        )}

        {/* IPO Cards Grid */}
        {!loading && (
          <>
            {filteredIPOs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIPOs.map((ipo) => (
                  <Link key={ipo.id} href={`/ipo/${ipo.id}`}>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-teal-300 transition cursor-pointer h-full">
                      {/* Company Info */}
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-slate-900">
                          {ipo.company.name}
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                          {ipo.company.symbol}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            ipo.status
                          )}`}
                        >
                          {ipo.status}
                        </span>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">Price Band</p>
                          <p className="font-bold text-slate-900">
                            {ipo.priceBand}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">
                            Issue Size
                          </p>
                          <p className="font-bold text-slate-900">
                            {ipo.issueSize}
                          </p>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-slate-600 text-xs mb-1">Open Date</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(ipo.openDate).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 text-xs mb-1">Close Date</p>
                          <p className="font-semibold text-slate-900">
                            {new Date(ipo.closeDate).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Returns (if listed) */}
                      {ipo.status === "LISTED" && ipo.listingGain !== null && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 mb-4">
                          <div>
                            <p className="text-xs text-slate-600 mb-1">
                              Listing Gain
                            </p>
                            <p className={`font-bold text-lg ${getReturnColor(ipo.listingGain)}`}>
                              {ipo.listingGain}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 mb-1">
                              Current Return
                            </p>
                            <p className={`font-bold text-lg ${getReturnColor(ipo.currentReturn)}`}>
                              {ipo.currentReturn}%
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Documents */}
                      {ipo.documents && ipo.documents.length > 0 && (
                        <div className="flex gap-2 mb-4 flex-wrap text-sm">
                          {ipo.documents[0]?.rhpPdf && (
                            <a
                              href={ipo.documents[0].rhpPdf}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              📄 RHP
                            </a>
                          )}
                          {ipo.documents[0]?.drhpPdf && (
                            <a
                              href={ipo.documents[0].drhpPdf}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              📄 DRHP
                            </a>
                          )}
                        </div>
                      )}

                      {/* View Details */}
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-teal-600 font-semibold text-sm hover:text-teal-700">
                          View Details →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">
                  No IPOs found with selected filter
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

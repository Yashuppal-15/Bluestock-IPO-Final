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
  const [filteredIpos, setFilteredIpos] = useState<IPO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchIPOs();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [ipos, filter, searchQuery, sortBy]);

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

  const applyFiltersAndSort = () => {
    let result = ipos;

    // Apply status filter
    if (filter !== "ALL") {
      result = result.filter((ipo) => ipo.status === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (ipo) =>
          ipo.company.name.toLowerCase().includes(query) ||
          ipo.company.symbol.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result = result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.openDate).getTime() - new Date(a.openDate).getTime();
        case "oldest":
          return new Date(a.openDate).getTime() - new Date(b.openDate).getTime();
        case "gain-high":
          return (b.listingGain || 0) - (a.listingGain || 0);
        case "gain-low":
          return (a.listingGain || 0) - (b.listingGain || 0);
        case "name":
          return a.company.name.localeCompare(b.company.name);
        default:
          return 0;
      }
    });

    setFilteredIpos(result);
  };

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover IPO Opportunities
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl">
            Track, analyze, and compare IPOs with real-time data and insights
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search by company name or symbol (e.g., Infosys, INFY)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-white focus:border-teal-500 focus:outline-none shadow-sm text-lg"
          />
        </div>

        {/* Filter & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Status
            </label>
            <div className="flex gap-2 flex-wrap">
              {["ALL", "UPCOMING", "OPEN", "CLOSED", "LISTED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === status
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-teal-600"
                  }`}
                >
                  {status}
                  <span className="ml-2 text-xs opacity-75">
                    ({ipos.filter((ipo) => (status === "ALL" ? true : ipo.status === status)).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-teal-500 focus:outline-none bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="gain-high">Highest Gain</option>
              <option value="gain-low">Lowest Gain</option>
              <option value="name">Company Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-slate-600 text-sm">
            Showing <span className="font-bold text-slate-900">{filteredIpos.length}</span> IPO
            {filteredIpos.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-slate-600 mt-2">Loading IPOs...</p>
          </div>
        )}

        {/* IPO Cards Grid */}
        {!loading && (
          <>
            {filteredIpos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIpos.map((ipo) => (
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
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-600 text-lg">
                  No IPOs found matching your search
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilter("ALL");
                  }}
                  className="mt-4 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

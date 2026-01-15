import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface Company {
  id: number;
  name: string;
  symbol?: string;
}

interface IPODocument {
  id: number;
  ipoId: number;
  rhpPdf?: string;
  drhpPdf?: string;
}

interface IPOData {
  id: number;
  companyId: number;
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
  company?: Company;
  documents?: IPODocument[];
}


export default function EditIPO() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    companyId: "",
    priceBand: "",
    openDate: "",
    closeDate: "",
    issueSize: "",
    issueType: "",
    listingDate: "",
    status: "UPCOMING",
    ipoPrice: "",
    listingPrice: "",
    listingGain: "",
    currentMarketPrice: "",
    currentReturn: "",
  });

  const [ipo, setIPO] = useState<any>(null);
  const [rhp, setRhp] = useState<File | null>(null);
  const [drhp, setDrhp] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated" && id) {
      fetchIPO();
      fetchCompanies();
    }
  }, [status, id, router]);

  const fetchIPO = async () => {
    try {
      const res = await fetch(`/api/ipos/${id}`);
      if (!res.ok) throw new Error("IPO not found");
      
      const data = await res.json();
      setIPO(data as IPOData);
      setForm({
        companyId: data.companyId.toString(),
        priceBand: data.priceBand,
        openDate: new Date(data.openDate).toISOString().split("T")[0],
        closeDate: new Date(data.closeDate).toISOString().split("T")[0],
        issueSize: data.issueSize,
        issueType: data.issueType,
        listingDate: data.listingDate
          ? new Date(data.listingDate).toISOString().split("T")[0]
          : "",
        status: data.status,
        ipoPrice: data.ipoPrice?.toString() || "",
        listingPrice: data.listingPrice?.toString() || "",
        listingGain: data.listingGain?.toString() || "",
        currentMarketPrice: data.currentMarketPrice?.toString() || "",
        currentReturn: data.currentReturn?.toString() || "",
      });
    } catch (error) {
      console.error("Error fetching IPO:", error);
      setError("Failed to load IPO");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data as any[]);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Upload files if provided
      if (rhp || drhp) {
        const fileData = new FormData();
        if (rhp) fileData.append("rhp", rhp);
        if (drhp) fileData.append("drhp", drhp);

        setUploadProgress(50);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        if (!uploadRes.ok) throw new Error("File upload failed");

        const files = await uploadRes.json();

        // Update documents
        await fetch("/api/documents/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ipoId: parseInt(id as string),
            rhpPdf: files.rhp || ipo.documents?.[0]?.rhpPdf,
            drhpPdf: files.drhp || ipo.documents?.[0]?.drhpPdf,
          }),
        });

        setUploadProgress(100);
      }

      // Update IPO
      const ipoRes = await fetch("/api/ipos/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parseInt(id as string),
          ...form,
          companyId: parseInt(form.companyId),
          ipoPrice: form.ipoPrice ? parseFloat(form.ipoPrice) : null,
          listingPrice: form.listingPrice ? parseFloat(form.listingPrice) : null,
          listingGain: form.listingGain ? parseFloat(form.listingGain) : null,
          currentMarketPrice: form.currentMarketPrice
            ? parseFloat(form.currentMarketPrice)
            : null,
          currentReturn: form.currentReturn
            ? parseFloat(form.currentReturn)
            : null,
        }),
      });

      if (!ipoRes.ok) throw new Error("Failed to update IPO");

      alert("IPO updated successfully!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error updating IPO:", error);
      setError("Failed to update IPO. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (status === "loading" || pageLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!ipo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">IPO not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Edit IPO - {ipo.company?.name}
          </h1>
          <a
            href="/admin/dashboard"
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700">Uploading files: {uploadProgress}%</p>
            <div className="w-full bg-blue-200 rounded h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <select
                name="companyId"
                value={form.companyId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Select Company</option>
                {companies.map((company: any) => (
                  <option key={company.id} value={company.id.toString()}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
      
            <div>
              <label className="block text-sm font-medium mb-1">Price Band *</label>
              <input
                type="text"
                name="priceBand"
                value={form.priceBand}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="e.g., 100-125"
              />
            </div>


            <div>
              <label className="block text-sm font-medium mb-1">Open Date *</label>
              <input
                type="date"
                name="openDate"
                value={form.openDate}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Close Date *</label>
              <input
                type="date"
                name="closeDate"
                value={form.closeDate}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Issue Size</label>
              <input
                type="text"
                name="issueSize"
                value={form.issueSize}
                onChange={handleChange}
                placeholder="e.g., 100 Cr"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Issue Type</label>
              <input
                type="text"
                name="issueType"
                value={form.issueType}
                onChange={handleChange}
                placeholder="e.g., Fresh Issue"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Listing Date</label>
              <input
                type="date"
                name="listingDate"
                value={form.listingDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              >
                <option value="UPCOMING">UPCOMING</option>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="LISTED">LISTED</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">IPO Price</label>
              <input
                type="number"
                step="0.01"
                name="ipoPrice"
                value={form.ipoPrice}
                onChange={handleChange}
                placeholder="e.g., 125.50"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Listing Price</label>
              <input
                type="number"
                step="0.01"
                name="listingPrice"
                value={form.listingPrice}
                onChange={handleChange}
                placeholder="e.g., 145.75"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Listing Gain %</label>
              <input
                type="number"
                step="0.01"
                name="listingGain"
                value={form.listingGain}
                onChange={handleChange}
                placeholder="e.g., 16.6"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Current Market Price</label>
              <input
                type="number"
                step="0.01"
                name="currentMarketPrice"
                value={form.currentMarketPrice}
                onChange={handleChange}
                placeholder="e.g., 150.25"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Current Return %</label>
              <input
                type="number"
                step="0.01"
                name="currentReturn"
                value={form.currentReturn}
                onChange={handleChange}
                placeholder="e.g., 20.2"
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Update Documents (Optional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">RHP PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setRhp(e.target.files?.[0] || null)}
                  className="w-full border px-3 py-2 rounded"
                />
                {ipo.documents?.[0]?.rhpPdf && (
                  <p className="text-sm text-gray-600 mt-1">Current: {ipo.documents[0].rhpPdf}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">DRHP PDF</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setDrhp(e.target.files?.[0] || null)}
                  className="w-full border px-3 py-2 rounded"
                />
                {ipo.documents?.[0]?.drhpPdf && (
                  <p className="text-sm text-gray-600 mt-1">Current: {ipo.documents[0].drhpPdf}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Updating IPO..." : "Update IPO"}
          </button>
        </form>
      </div>
    </div>
  );
}

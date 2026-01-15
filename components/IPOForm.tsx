import { useState, useEffect } from "react";

interface IPOFormProps {
  companies: any[];
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function IPOForm({
  companies,
  initialData,
  onSubmit,
  isLoading,
}: IPOFormProps) {
  const [formData, setFormData] = useState({
    companyId: initialData?.companyId || "",
    priceBand: initialData?.priceBand || "",
    openDate: initialData?.openDate
      ? new Date(initialData.openDate).toISOString().split("T")[0]
      : "",
    closeDate: initialData?.closeDate
      ? new Date(initialData.closeDate).toISOString().split("T")[0]
      : "",
    issueSize: initialData?.issueSize || "",
    issueType: initialData?.issueType || "",
    listingDate: initialData?.listingDate
      ? new Date(initialData.listingDate).toISOString().split("T")[0]
      : "",
    status: initialData?.status || "UPCOMING",
    ipoPrice: initialData?.ipoPrice || "",
    listingPrice: initialData?.listingPrice || "",
    listingGain: initialData?.listingGain || "",
    currentMarketPrice: initialData?.currentMarketPrice || "",
    currentReturn: initialData?.currentReturn || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: initialData?.id,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price Band</label>
          <input
            type="text"
            name="priceBand"
            value={formData.priceBand}
            onChange={handleChange}
            placeholder="e.g., ₹100 - ₹150"
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Open Date</label>
          <input
            type="date"
            name="openDate"
            value={formData.openDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Close Date</label>
          <input
            type="date"
            name="closeDate"
            value={formData.closeDate}
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
            value={formData.issueSize}
            onChange={handleChange}
            placeholder="e.g., 100 Cr"
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Issue Type</label>
          <input
            type="text"
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            placeholder="e.g., Fresh Issue"
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Listing Date</label>
          <input
            type="date"
            name="listingDate"
            value={formData.listingDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
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
            value={formData.ipoPrice}
            onChange={handleChange}
            placeholder="e.g., 125.50"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Listing Price
          </label>
          <input
            type="number"
            step="0.01"
            name="listingPrice"
            value={formData.listingPrice}
            onChange={handleChange}
            placeholder="e.g., 145.75"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Listing Gain %
          </label>
          <input
            type="number"
            step="0.01"
            name="listingGain"
            value={formData.listingGain}
            onChange={handleChange}
            placeholder="e.g., 16.6"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Current Market Price
          </label>
          <input
            type="number"
            step="0.01"
            name="currentMarketPrice"
            value={formData.currentMarketPrice}
            onChange={handleChange}
            placeholder="e.g., 150.25"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Current Return %
          </label>
          <input
            type="number"
            step="0.01"
            name="currentReturn"
            value={formData.currentReturn}
            onChange={handleChange}
            placeholder="e.g., 20.2"
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-2 rounded-lg transition"
      >
        {isLoading ? "Saving..." : initialData ? "Update IPO" : "Create IPO"}
      </button>
    </form>
  );
}

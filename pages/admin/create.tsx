import { useRouter } from "next/router";
import { useState } from "react";

export default function CreateIPO() {
  const router = useRouter();
  const [form, setForm] = useState({
    company: { name: "", logo: "" },
    priceBand: "",
    openDate: "",
    closeDate: "",
    issueSize: "",
    issueType: "",
    listingDate: "",
    status: "",
    ipoPrice: "",
    listingPrice: "",
    listingGain: "",
    currentMarketPrice: "",
    currentReturn: "",
  });

  const [rhp, setRhp] = useState(null);
  const [drhp, setDrhp] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("company.")) {
      const key = name.split(".")[1];
      setForm({ ...form, company: { ...form.company, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload files first
    const fileData = new FormData();
    fileData.append("rhp", rhp);
    fileData.append("drhp", drhp);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: fileData,
    });
    const files = await uploadRes.json();

    // Create IPO
    await fetch("/api/ipos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        documents: {
          rhpPdf: `/docs/${files.rhp}`,
          drhpPdf: `/docs/${files.drhp}`,
        },
      }),
    });

    router.push("/admin/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Add New IPO</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="company.name" placeholder="Company Name" className="w-full border p-2" onChange={handleChange} required />
        <input name="company.logo" placeholder="Logo URL" className="w-full border p-2" onChange={handleChange} required />
        <input name="priceBand" placeholder="Price Band" className="w-full border p-2" onChange={handleChange} required />
        <input type="date" name="openDate" className="w-full border p-2" onChange={handleChange} required />
        <input type="date" name="closeDate" className="w-full border p-2" onChange={handleChange} required />
        <input name="issueSize" placeholder="Issue Size" className="w-full border p-2" onChange={handleChange} />
        <input name="issueType" placeholder="Issue Type" className="w-full border p-2" onChange={handleChange} />
        <input type="date" name="listingDate" className="w-full border p-2" onChange={handleChange} required />
        <input name="status" placeholder="Status" className="w-full border p-2" onChange={handleChange} />
        <input name="ipoPrice" placeholder="IPO Price" type="number" className="w-full border p-2" onChange={handleChange} />
        <input name="listingPrice" placeholder="Listing Price" type="number" className="w-full border p-2" onChange={handleChange} />
        <input name="listingGain" placeholder="Listing Gain (%)" type="number" className="w-full border p-2" onChange={handleChange} />
        <input name="currentMarketPrice" placeholder="CMP" type="number" className="w-full border p-2" onChange={handleChange} />
        <input name="currentReturn" placeholder="Return (%)" type="number" className="w-full border p-2" onChange={handleChange} />

        <input type="file" onChange={(e) => setRhp(e.target.files[0])} required />
        <input type="file" onChange={(e) => setDrhp(e.target.files[0])} required />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Create IPO
        </button>
      </form>
    </div>
  );
}

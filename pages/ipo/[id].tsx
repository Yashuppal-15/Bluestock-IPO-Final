import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function IpoDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ipo, setIpo] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/ipos/${id}`)
        .then((res) => res.json())
        .then((data) => setIpo(data));
    }
  }, [id]);

  if (!ipo) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{ipo.company.name}</h1>
      <p className="mb-2">Issue Type: {ipo.issueType}</p>
      <p>Open Date: {new Date(ipo.openDate).toLocaleDateString()}</p>
      <p>Close Date: {new Date(ipo.closeDate).toLocaleDateString()}</p>
      <p>Listing Date: {new Date(ipo.listingDate).toLocaleDateString()}</p>
      <p>IPO Price: ₹{ipo.ipoPrice}</p>
      <p>Listing Price: ₹{ipo.listingPrice}</p>
      <p>Current Market Price: ₹{ipo.currentMarketPrice}</p>
      <p>Current Return: {ipo.currentReturn}%</p>

      <div className="mt-4">
        <a
          href={ipo.documents[0]?.rhpPdf}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline mr-4"
        >
          Download RHP
        </a>
        <a
          href={ipo.documents[0]?.drhpPdf}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          Download DRHP
        </a>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 inline-block bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        ← Back
      </button>
    </div>
  );
}

<<<<<<< HEAD
import { useEffect, useState } from "react";

export default function HomePage() {
  const [ipos, setIpos] = useState([]);

  useEffect(() => {
    fetch("/api/ipos")
      .then((res) => res.json())
      .then((data) => setIpos(data));
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">IPO Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ipos.map((ipo) => (
          <div key={ipo.id} className="border rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-semibold">{ipo.company.name}</h2>
            <p className="text-sm text-gray-500">{ipo.priceBand}</p>
            <p>Open: {new Date(ipo.openDate).toLocaleDateString()}</p>
            <p>Close: {new Date(ipo.closeDate).toLocaleDateString()}</p>
            <p>Gain: {ipo.listingGain}%</p>

            <div className="flex gap-2 mt-2">
              <a
                href={ipo.documents[0]?.rhpPdf}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                RHP
              </a>
              <a
                href={ipo.documents[0]?.drhpPdf}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                DRHP
              </a>
            </div>

            <a
              href={`/ipo/${ipo.id}`}
              className="mt-3 inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
=======
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [ipos, setIpos] = useState([])

  useEffect(() => {
    fetch('/api/ipos')
      .then(res => res.json())
      .then(data => setIpos(data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">IPO Listings</h1>
      <ul className="space-y-4">
        {ipos.map(ipo => (
          <li key={ipo.id} className="border p-4 rounded shadow">
            <Link href={`/ipos/${ipo.id}`}>
              <div>
                <h2 className="text-xl font-semibold">{ipo.company.name}</h2>
                <p>Status: {ipo.status}</p>
                <p>Price Band: {ipo.priceBand}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
>>>>>>> 13afdbb2f8984d86bb8e371f0ead079c79d33354

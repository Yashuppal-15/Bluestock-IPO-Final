import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function IpoDetail() {
  const router = useRouter()
  const { id } = router.query
  const [ipo, setIpo] = useState(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/ipos/${id}`)
        .then(res => res.json())
        .then(data => setIpo(data))
    }
  }, [id])

  if (!ipo) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{ipo.company.name}</h1>
      <p>Status: {ipo.status}</p>
      <p>IPO Price: ₹{ipo.ipoPrice}</p>
      <p>Listing Price: ₹{ipo.listingPrice}</p>
      <p>Current Market Price: ₹{ipo.currentMarketPrice}</p>
      <p>Current Return: {ipo.currentReturn}%</p>
      <div className="mt-4">
        <a href={ipo.documents[0]?.rhpPdf} target="_blank" rel="noreferrer" className="text-blue-500 underline">View RHP</a>
        <br />
        <a href={ipo.documents[0]?.drhpPdf} target="_blank" rel="noreferrer" className="text-blue-500 underline">View DRHP</a>
      </div>
    </div>
  )
}

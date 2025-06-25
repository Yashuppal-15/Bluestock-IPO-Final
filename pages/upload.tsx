import { useState } from 'react'

export default function UploadForm() {
  const [form, setForm] = useState({ companyId: '', rhpPdf: '', drhpPdf: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    alert('Document uploaded')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload IPO Documents</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Company ID"
          value={form.companyId}
          onChange={e => setForm({ ...form, companyId: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="RHP PDF URL"
          value={form.rhpPdf}
          onChange={e => setForm({ ...form, rhpPdf: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="DRHP PDF URL"
          value={form.drhpPdf}
          onChange={e => setForm({ ...form, drhpPdf: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </div>
  )
}
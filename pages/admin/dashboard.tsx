import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const [ipos, setIpos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("admin-auth") !== "true") {
      router.push("/admin/login");
    } else {
      fetchIPOs();
    }
  }, []);

  const fetchIPOs = async () => {
    const res = await fetch("/api/ipos");
    const data = await res.json();
    setIpos(data);
  };

  const deleteIPO = async (id) => {
    await fetch(`/api/ipos/${id}`, { method: "DELETE" });
    fetchIPOs();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        onClick={() => router.push("/admin/create")}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Add New IPO
      </button>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Company</th>
            <th className="p-2">Dates</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {ipos.map((ipo) => (
            <tr key={ipo.id} className="border-t">
              <td className="p-2">{ipo.company.name}</td>
              <td className="p-2">
                {new Date(ipo.openDate).toLocaleDateString()} –{" "}
                {new Date(ipo.closeDate).toLocaleDateString()}
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteIPO(ipo.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

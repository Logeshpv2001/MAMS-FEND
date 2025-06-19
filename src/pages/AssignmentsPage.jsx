import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [formData, setFormData] = useState({
    asset_id: "",
    personnel_name: "",
    base_id: "",
    quantity: 0,
    status: "assigned",
    date: "",
  });
  const [error, setError] = useState("");

  const STATUS = ["assigned", "returned", "expended", "lost"];

  useEffect(() => {
    fetchAssignments();
    fetchAssets();
    fetchBases();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axiosInstance.get("/assignment");
      setAssignments(res.data);
    } catch (err) {
      setError("Failed to fetch assignments.");
    }
  };

  const fetchAssets = async () => {
    const res = await axiosInstance.get("/asset/get-all");
    setAssets(res.data);
  };

  const fetchBases = async () => {
    const res = await axiosInstance.get("/base/get-all-base");
    setBases(res.data);
  };

  const handleAssign = async () => {
    try {
      await axiosInstance.post("/assignment", formData);
      setFormData({
        asset_id: "",
        personnel_name: "",
        base_id: "",
        quantity: 0,
        status: "assigned",
        date: "",
      });
      fetchAssignments();
    } catch (err) {
      setError("Failed to assign asset.");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.put(`/assignment/${id}/status`, { status });
      fetchAssignments();
    } catch (err) {
      setError("Failed to update assignment status.");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Asset Assignments</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Assign Asset</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <select
            value={formData.asset_id}
            onChange={(e) =>
              setFormData({ ...formData, asset_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.type})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Personnel Name"
            value={formData.personnel_name}
            onChange={(e) =>
              setFormData({ ...formData, personnel_name: e.target.value })
            }
            className="border p-2 rounded"
          />

          <select
            value={formData.base_id}
            onChange={(e) =>
              setFormData({ ...formData, base_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Base</option>
            {bases.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="border p-2 rounded"
          />

          <button
            onClick={handleAssign}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Assignments History</h2>

      <div className="hidden md:block">
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Asset</th>
              <th className="border px-3 py-2">Personnel</th>
              <th className="border px-3 py-2">Base</th>
              <th className="border px-3 py-2">Qty</th>
              <th className="border px-3 py-2">Date</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => {
              const asset = assets.find((as) => as.id === a.asset_id);
              const base = bases.find((b) => b.id === a.base_id);
              return (
                <tr key={a.id}>
                  <td className="border px-3 py-2">{a.id}</td>
                  <td className="border px-3 py-2">{asset?.name}</td>
                  <td className="border px-3 py-2">{a.personnel_name}</td>
                  <td className="border px-3 py-2">{base?.name}</td>
                  <td className="border px-3 py-2">{a.quantity}</td>
                  <td className="border px-3 py-2">{a.date}</td>
                  <td className="border px-3 py-2">{a.status}</td>
                  <td className="border px-3 py-2">
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusUpdate(a.id, e.target.value)}
                      className="text-sm bg-white border border-gray-300 rounded px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {assignments.map((a) => {
          const asset = assets.find((as) => as.id === a.asset_id);
          const base = bases.find((b) => b.id === a.base_id);
          return (
            <div key={a.id} className="border rounded p-4 shadow-sm">
              <p>
                <strong>ID:</strong> {a.id}
              </p>
              <p>
                <strong>Asset:</strong> {asset?.name}
              </p>
              <p>
                <strong>Personnel:</strong> {a.personnel_name}
              </p>
              <p>
                <strong>Base:</strong> {base?.name}
              </p>
              <p>
                <strong>Qty:</strong> {a.quantity}
              </p>
              <p>
                <strong>Date:</strong> {a.date}
              </p>
              <p>
                <strong>Status:</strong>
              </p>
              <select
                value={a.status}
                onChange={(e) => handleStatusUpdate(a.id, e.target.value)}
                className="w-full mt-1 bg-white border border-gray-300 rounded px-2 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentsPage;

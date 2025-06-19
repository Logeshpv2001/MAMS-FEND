import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const PurchasesPage = () => {
  const { user } = useAuth();

  const [purchases, setPurchases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [newPurchase, setNewPurchase] = useState({
    asset_id: "",
    base_id: "",
    quantity: 0,
    date: "",
  });

  const [filters, setFilters] = useState({
    date: "",
    base_id: "",
    asset_type: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetchPurchases();
    fetchAssets();
    fetchBases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axiosInstance.get("/purchase/get");
      setPurchases(res.data);
    } catch (err) {
      setError("Failed to fetch purchases.");
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

  const handleCreate = async () => {
    try {
      const payload = {
        asset_id: parseInt(newPurchase.asset_id),
        base_id: parseInt(newPurchase.base_id),
        quantity: parseInt(newPurchase.quantity),
        date: newPurchase.date
          ? new Date(newPurchase.date)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ")
          : null,
      };
      console.log(payload);
      await axiosInstance.post("/purchase/create", payload);
      setNewPurchase({ asset_id: "", base_id: "", quantity: 0, date: "" });
      fetchPurchases();
    } catch (err) {
      setError("Failed to create purchase.");
    }
  };

  const filteredPurchases = purchases.filter((p) => {
    const matchDate = filters.date ? p.date === filters.date : true;
    const matchBase = filters.base_id
      ? p.base_id === parseInt(filters.base_id)
      : true;
    const asset = assets.find((a) => a.id === p.asset_id);
    const matchType = filters.asset_type
      ? asset?.type === filters.asset_type
      : true;
    return matchDate && matchBase && matchType;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Purchases</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Record New Purchase</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            value={newPurchase.asset_id}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, asset_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.type})
              </option>
            ))}
          </select>

          <select
            value={newPurchase.base_id}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, base_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Base</option>
            {bases.map((base) => (
              <option key={base.id} value={base.id}>
                {base.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={newPurchase.quantity}
            onChange={(e) =>
              setNewPurchase({
                ...newPurchase,
                quantity: parseInt(e.target.value),
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={newPurchase.date}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, date: e.target.value })
            }
            className="border p-2 rounded"
          />

          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filter Purchases</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={filters.base_id}
            onChange={(e) =>
              setFilters({ ...filters, base_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Filter by Base</option>
            {bases.map((base) => (
              <option key={base.id} value={base.id}>
                {base.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Asset Type (e.g. weapon)"
            value={filters.asset_type}
            onChange={(e) =>
              setFilters({ ...filters, asset_type: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
      </div>

      <table className="w-full table-auto border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Asset</th>
            <th className="border px-3 py-2">Base</th>
            <th className="border px-3 py-2">Quantity</th>
            <th className="border px-3 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.map((p) => {
            const asset = assets.find((a) => a.id === p.asset_id);
            const base = bases.find((b) => b.id === p.base_id);
            return (
              <tr key={p.id}>
                <td className="border px-3 py-2">{p.id}</td>
                <td className="border px-3 py-2">
                  {asset?.name} ({asset?.type})
                </td>
                <td className="border px-3 py-2">{base?.name}</td>
                <td className="border px-3 py-2">{p.quantity}</td>
                <td className="border px-3 py-2">{p.date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PurchasesPage;

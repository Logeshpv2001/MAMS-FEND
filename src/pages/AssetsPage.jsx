import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AssetsPage = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "",
    total_qty: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axiosInstance.get("/asset/get-all");
      setAssets(res.data);
    } catch (err) {
      setError("Failed to load assets.");
    }
  };

  const handleCreate = async () => {
    if (!newAsset.name || !newAsset.type || newAsset.total_qty <= 0) {
      setError("Please fill all fields correctly.");
      toast.error("Please fill all fields correctly.");
      return;
    }

    try {
      await axiosInstance.post("/asset/add", newAsset);
      setNewAsset({ name: "", type: "", total_qty: 0 });
      fetchAssets();
      toast.success("Asset created successfully!");
    } catch (err) {
      setError("Failed to create asset.");
      toast.error("Failed to create asset.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAsset((prev) => ({
      ...prev,
      [name]: name === "total_qty" ? parseInt(value) : value,
    }));
  };

  if (!["admin", "logistics"].includes(user?.role)) {
    return (
      <div className="text-center mt-20 text-red-500 text-lg">
        Unauthorized - Access denied
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Assets</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Asset</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            name="name"
            placeholder="Asset Name"
            value={newAsset.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="type"
            placeholder="Asset Type"
            value={newAsset.type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="total_qty"
            placeholder="Total Quantity"
            value={newAsset.total_qty}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Asset
          </button>
        </div>
      </div>

      <table className="w-full table-auto border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td className="border px-3 py-2">{asset.id}</td>
              <td className="border px-3 py-2">{asset.name}</td>
              <td className="border px-3 py-2">{asset.type}</td>
              <td className="border px-3 py-2">{asset.total_qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetsPage;

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const TransfersPage = () => {
  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [error, setError] = useState("");
  const [transferData, setTransferData] = useState({
    asset_id: "",
    from_base_id: "",
    to_base_id: "",
    quantity: 0,
    date: "",
  });

  useEffect(() => {
    fetchTransfers();
    fetchAssets();
    fetchBases();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await axiosInstance.get("/transfer/get-all");
      setTransfers(res.data);
    } catch (err) {
      setError("Failed to fetch transfer history.");
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

  const handleTransfer = async () => {
    try {
      await axiosInstance.post("/transfer/create", transferData);
      setTransferData({
        asset_id: "",
        from_base_id: "",
        to_base_id: "",
        quantity: 0,
        date: "",
      });
      fetchTransfers();
      toast.success("Asset transferred successfully!");
    } catch (err) {
      setError("Transfer failed. Make sure inputs are valid.");
      toast.error("Transfer failed. Please check the inputs.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transfer Assets Between Bases</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">New Transfer</h2>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
          <select
            value={transferData.asset_id}
            onChange={(e) =>
              setTransferData({ ...transferData, asset_id: e.target.value })
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

          <select
            value={transferData.from_base_id}
            onChange={(e) =>
              setTransferData({ ...transferData, from_base_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">From Base</option>
            {bases.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={transferData.to_base_id}
            onChange={(e) =>
              setTransferData({ ...transferData, to_base_id: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">To Base</option>
            {bases.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={transferData.quantity}
            onChange={(e) =>
              setTransferData({
                ...transferData,
                quantity: parseInt(e.target.value),
              })
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={transferData.date}
            onChange={(e) =>
              setTransferData({ ...transferData, date: e.target.value })
            }
            className="border p-2 rounded"
          />

          <button
            onClick={handleTransfer}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Transfer
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Transfer History</h2>
        <table className="w-full table-auto border mt-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Asset</th>
              <th className="border px-3 py-2">From Base</th>
              <th className="border px-3 py-2">To Base</th>
              <th className="border px-3 py-2">Quantity</th>
              <th className="border px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t) => {
              const asset = assets.find((a) => a.id === t.asset_id);
              const fromBase = bases.find((b) => b.id === t.from_base_id);
              const toBase = bases.find((b) => b.id === t.to_base_id);
              return (
                <tr key={t.id}>
                  <td className="border px-3 py-2">{t.id}</td>
                  <td className="border px-3 py-2">{asset?.name}</td>
                  <td className="border px-3 py-2">{fromBase?.name}</td>
                  <td className="border px-3 py-2">{toBase?.name}</td>
                  <td className="border px-3 py-2">{t.quantity}</td>
                  <td className="border px-3 py-2">
                    {dayjs(t.date).format("DD-MM-YYYY")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransfersPage;

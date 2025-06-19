import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const BasesPage = () => {
  const { user } = useAuth();
  const [bases, setBases] = useState([]);
  const [newBase, setNewBase] = useState({ name: "", location: "" });
  const [editBase, setEditBase] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    try {
      const res = await axiosInstance.get("/base/get-all-base");
      console.log(res);
      setBases(res.data);
    } catch (err) {
      setError("Failed to fetch bases.");
    }
  };

  const handleCreate = async () => {
    if (!newBase.name || !newBase.location) {
      return setError("Name and Location are required");
    }

    try {
      await axiosInstance.post("/base/create", newBase);
      setNewBase({ name: "", location: "" });
      fetchBases();
    } catch (err) {
      setError("Failed to create base.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBase((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      await axiosInstance.put(`/base/edit/${id}`, {
        name: editBase.name,
        location: editBase.location,
      });
      setEditBase(null);
      fetchBases();
    } catch (err) {
      setError("Failed to update base.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Bases</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Create New Base</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Base Name"
            value={newBase.name}
            onChange={(e) => setNewBase({ ...newBase, name: e.target.value })}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Location"
            value={newBase.location}
            onChange={(e) =>
              setNewBase({ ...newBase, location: e.target.value })
            }
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Base
          </button>
        </div>
      </div>

      <table className="w-full table-auto border mt-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Location</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bases.map((base) => (
            <tr key={base.id}>
              <td className="border px-3 py-2">{base.id}</td>
              <td className="border px-3 py-2">
                {editBase?.id === base.id ? (
                  <input
                    name="name"
                    value={editBase.name}
                    onChange={handleEditChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  base.name
                )}
              </td>
              <td className="border px-3 py-2">
                {editBase?.id === base.id ? (
                  <input
                    name="location"
                    value={editBase.location}
                    onChange={handleEditChange}
                    className="border p-1 w-full"
                  />
                ) : (
                  base.location
                )}
              </td>
              <td className="border px-3 py-2 space-x-2">
                {editBase?.id === base.id ? (
                  <button
                    onClick={() => handleUpdate(base.id)}
                    className="bg-blue-600 text-white! px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setEditBase({
                        id: base.id,
                        name: base.name,
                        location: base.location,
                      })
                    }
                    className="bg-gray-600 text-white! px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BasesPage;

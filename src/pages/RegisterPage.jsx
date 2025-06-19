import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import loftwall from "../assets/loft-wall.jpg";
import logo from "../assets/logo.jpg";

const RegisterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "commander",
    base_id: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (user?.role !== "admin") {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold text-xl">
        Unauthorized - Admin access only
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post("/auth/register", formData);
      console.log(res);
      setSuccess("User registered successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "commander",
        base_id: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-center bg-cover px-4"
      style={{
        backgroundImage: `url(${loftwall})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#f0eada] border-green-900 p-8 rounded shadow-md w-full max-w-md"
      >
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Military Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-green-900">
          Register New User
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}

        <div className="mb-4">
          <label className="block mb-1  text-green-900 ">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white border-green-600 "
            placeholder="User name"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1  text-green-900">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white border-green-600 "
            placeholder="Email"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1  text-green-900">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white border-green-600 "
            placeholder="Password"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1  text-green-900">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded bg-white border-green-600 "
          >
            <option value="commander">Base Commander</option>
            <option value="logistics">Logistics Officer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1  text-green-900">Base ID</label>
          <input
            name="base_id"
            value={formData.base_id}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded bg-white border-green-600 "
            placeholder="e.g. 1"
          />
        </div>

        <button
          type="submit"
          className=" bg-green-800 text-white w-full py-2 rounded hover:bg-green-900"
        >
          Register User
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;

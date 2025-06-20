import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import loftwall from "../assets/loft-wall.jpg";
import logo from "../assets/logo.jpg";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      toast.success("Login successful!");
    } catch (err) {
      setError("Invalid email or password.");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="flex items-center h-full w-full justify-center min-h-screen bg-center bg-cover px-4"
      style={{
        backgroundImage: `url(${loftwall})`,
      }}
    >
      <div className="w-full max-w-md bg-[#f0eada] rounded-xl shadow-2xl p-8 border border-green-900">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Military Logo" className="h-12" />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-green-900 mb-4 tracking-wide">
          Sign In
        </h2>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-green-900 text-sm font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-green-600 rounded-md bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="you@military.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-green-900 text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-green-600 rounded-md bg-white text-green-900 focus:outline-none focus:ring-2 focus:ring-green-700"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 text-white font-bold py-2 px-4 rounded-md hover:bg-green-900 transition duration-200 tracking-wide"
          >
            Log In
          </button>
        </form>

        {/* <p className="text-center text-sm text-green-900 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-green-800 hover:underline font-semibold"
          >
            Register
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default LoginPage;

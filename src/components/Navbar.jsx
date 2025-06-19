import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const logoutUser = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full h-[10vh] bg-[#1f2e1f] border-b-2 border-green-900 text-white flex items-center justify-between px-6 shadow-md relative z-50">
      <div className="flex justify-center md:justify-start items-center flex-1 md:flex-none">
        <img
          src={logo}
          alt="ArmyOps Logo"
          className="w-28 h-12 sm:w-36 sm:h-14 object-contain"
        />
      </div>

      <h1 className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-lg md:text-xl lg:text-2xl font-extrabold tracking-wide text-green-300 shadow-[0_0_5px_#22c55e] uppercase text-center">
        Military Asset Management System
      </h1>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <div className="text-sm sm:text-base text-green-300 text-center">
          <div className="font-bold truncate max-w-[80px] sm:max-w-none">
            {user?.name || "User"}
          </div>
          <div className="text-xs capitalize">{user?.role || "role"}</div>
        </div>
        <button
          onClick={logoutUser}
          className="bg-green-700 hover:bg-green-800 text-white px-2 sm:px-3 py-1 rounded-md text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;

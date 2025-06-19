import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  GiPistolGun,
  GiAmmoBox,
  GiMilitaryFort,
  GiWatchtower,
} from "react-icons/gi";
import {
  FaHome,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hasManuallyToggled = useRef(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= 768;
      setIsDesktop(isNowDesktop);

      if (!hasManuallyToggled.current) {
        setIsOpen(isNowDesktop);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    hasManuallyToggled.current = true;
    setIsOpen((prev) => !prev);
  };

  return (
    <>

      {!isDesktop && (
        <button
          className="fixed top-4 left-4 z-50 text-white bg-green-700 p-2 rounded-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {isDesktop && (
        <button
          className="fixed top-[50%] left-0 z-50 bg-green-800 text-white p-2 rounded-r-md"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <IoChevronBack size={20} />
          ) : (
            <IoChevronForward size={20} />
          )}
        </button>
      )}

      <div
        className={`bg-[#1f2e1f] text-white shadow-xl border-r-2 border-green-900
        w-64 z-40 transition-transform duration-300 ease-in-out
        fixed top-[10vh] h-[90vh]
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-green-800">
          <div>
            <h2 className="text-xl font-bold text-green-300 tracking-wider uppercase">
              🪖 MAMS
            </h2>
            <p className="text-xs text-green-500">Asset Control Unit</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 mt-6 px-2">
          <NavItem to="/dashboard" icon={<FaHome />} label="Dashboard" />
          <NavItem to="/assets" icon={<GiAmmoBox />} label="Assets" />
          <NavItem
            to="/assignment"
            icon={<FaClipboardList />}
            label="Assignments"
          />
          <NavItem
            to="/transfers"
            icon={<GiMilitaryFort />}
            label="Transfers"
          />
          <NavItem to="/purchases" icon={<GiPistolGun />} label="Purchases" />
          <NavItem to="/users" icon={<FaUsers />} label="Users" />
          <NavItem to="/bases" icon={<GiWatchtower />} label="Bases" />
        </nav>
      </div>
    </>
  );
};

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${
        isActive
          ? "bg-green-700 text-white"
          : "text-green-200 hover:bg-green-800 hover:text-white"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;

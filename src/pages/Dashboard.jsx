import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Modal from "../components/Modal";
import { GiRank1, GiAmmoBox, GiMilitaryFort, GiBullets } from "react-icons/gi";
import { FaBalanceScale, FaRegCheckCircle } from "react-icons/fa";
import loftwall from "../assets/loft-wall.jpg";

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [popupData, setPopupData] = useState([]);
  const [popupTitle, setPopupTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axiosInstance.get("/asset/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Error loading summary:", err);
    }
  };

  const openPopup = async (type) => {
    let url = "";
    if (type === "Purchases") url = "/purchases";
    else if (type === "Transfers In") url = "/transfers?direction=in";
    else if (type === "Transfers Out") url = "/transfers?direction=out";
    else return;

    try {
      const res = await axiosInstance.get(url);
      setPopupData(res.data);
      setPopupTitle(type);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching drill-down data:", err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPopupData([]);
  };

  const iconMap = {
    "Opening Balance": <GiRank1 className="text-green-800 text-2xl" />,
    Purchases: <GiAmmoBox className="text-yellow-700 text-2xl" />,
    "Transfers In": <GiMilitaryFort className="text-blue-700 text-2xl" />,
    "Transfers Out": <GiBullets className="text-red-600 text-2xl" />,
    "Net Movement": <FaBalanceScale className="text-gray-800 text-2xl" />,
    Assigned: <FaRegCheckCircle className="text-orange-700 text-2xl" />,
    Expended: <GiBullets className="text-black text-2xl" />,
    "Closing Balance": <GiRank1 className="text-green-600 text-2xl" />,
  };

  const StatCard = ({ label, value, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-[#f4f5f2] border-2 border-green-900 p-4 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition hover:bg-green-100`}
    >
      <div className="flex items-center gap-3 mb-2">
        {iconMap[label]}
        <p className="text-green-900 font-semibold text-sm uppercase">
          {label}
        </p>
      </div>
      <h2 className="text-2xl font-extrabold text-gray-900">{value}</h2>
    </div>
  );

  return (
    <div
      className=" bg-gradient-to-br from-[#223322] to-[#445544] p-6 text-white h-full"
      style={{
        backgroundImage: `url(${loftwall})`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-6 text-center  uppercase tracking-widest text-[#f4f1e6] drop-shadow-xl">
          🪖 Military Asset Summary Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Opening Balance"
            value={summary.opening_balance || 0}
          />
          <StatCard
            label="Purchases"
            value={summary.purchases || 0}
            onClick={() => openPopup("Purchases")}
          />
          <StatCard
            label="Transfers In"
            value={summary.transfers_in || 0}
            onClick={() => openPopup("Transfers In")}
          />
          <StatCard
            label="Transfers Out"
            value={summary.transfers_out || 0}
            onClick={() => openPopup("Transfers Out")}
          />
          <StatCard label="Net Movement" value={summary.net_movement || 0} />
          <StatCard label="Assigned" value={summary.assigned || 0} />
          <StatCard label="Expended" value={summary.expended || 0} />
          <StatCard
            label="Closing Balance"
            value={summary.closing_balance || 0}
          />
        </div>

        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={`🔍 ${popupTitle}`}
        >
          <div className="overflow-x-auto max-h-96 bg-white text-black rounded-lg">
            <table className="w-full table-auto border border-collapse">
              <thead className="bg-green-200 sticky top-0 z-10">
                <tr>
                  {popupData.length > 0 &&
                    Object.keys(popupData[0]).map((key) => (
                      <th
                        key={key}
                        className="border px-2 py-1 text-left text-xs uppercase"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {popupData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-100 text-sm">
                    {Object.values(item).map((val, idx) => (
                      <td key={idx} className="border px-2 py-1">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {popupData.length === 0 && (
              <p className="text-gray-600 p-4">No data found</p>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;

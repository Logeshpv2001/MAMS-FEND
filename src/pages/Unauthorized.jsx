import React from "react";
import unauthorized from "../assets/Unauthorized.jpg";

const Unauthorized = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-2">
        403 - Unauthorized
      </h1>
      <p className="text-gray-500 mb-4">
        You do not have permission to access this page.
      </p>
      <img
        src={unauthorized}
        alt="Unauthorized Access"
        className="w-64 h-64 object-contain"
      />
    </div>
  );
};

export default Unauthorized;

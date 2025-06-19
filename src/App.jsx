import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./routes/PrivateRoute";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./context/AuthContext";
import UsersPage from "./pages/UsersPage";
import BasesPage from "./pages/BasesPage";
import AssetsPage from "./pages/AssetsPage";
import PurchasesPage from "./pages/PurchasesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import TransfersPage from "./pages/TransfersPage";
import Navbar from "./components/Navbar";
import Unauthorized from "./pages/Unauthorized";

const App = () => {
  const { role, user } = useAuth();
  const location = useLocation();

  const hideLayout = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-screen ">
      {!hideLayout && <Navbar />}
      <div className="w-screen flex flex-row">
        {!hideLayout && <Sidebar />}

        <div className="flex-grow h-[90vh]">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/register"
              element={
                <PrivateRoute>
                  {role === "admin" ? <RegisterPage /> : <Unauthorized />}
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute>
                  {user?.role === "admin" ? <UsersPage /> : <Unauthorized />}
                </PrivateRoute>
              }
            />

            <Route
              path="/bases"
              element={
                <PrivateRoute>
                  {user?.role === "admin" ? <BasesPage /> : <Unauthorized />}
                </PrivateRoute>
              }
            />

            <Route
              path="/assets"
              element={
                <PrivateRoute>
                  {["admin", "logistics"].includes(user?.role) ? (
                    <AssetsPage />
                  ) : (
                    <Unauthorized />
                  )}
                </PrivateRoute>
              }
            />

            <Route
              path="/purchases"
              element={
                <PrivateRoute>
                  {["admin", "logistics"].includes(user?.role) ? (
                    <PurchasesPage />
                  ) : (
                    <Unauthorized />
                  )}
                </PrivateRoute>
              }
            />

            <Route
              path="/transfers"
              element={
                <PrivateRoute>
                  {["admin", "logistics", "commander"].includes(user?.role) ? (
                    <TransfersPage />
                  ) : (
                    <Unauthorized />
                  )}
                </PrivateRoute>
              }
            />

            <Route
              path="/assignment"
              element={
                <PrivateRoute>
                  {["admin", "logistics", "commander"].includes(user?.role) ? (
                    <AssignmentsPage />
                  ) : (
                    <Unauthorized />
                  )}
                </PrivateRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  {["admin", "logistics", "commander"].includes(user?.role) ? (
                    <Dashboard />
                  ) : (
                    <Unauthorized />
                  )}
                </PrivateRoute>
              }
            />

            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;

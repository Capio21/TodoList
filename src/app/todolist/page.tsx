"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaBars, FaTimes, FaHome, FaTasks, FaUserAlt, FaProjectDiagram, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Sidebar from "../Components/Sidebar";

export default function TodoList() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, redirecting to login.");
        router.push("/login");
        return;
      }
      await axios.post("http://127.0.0.1:8000/api/logout", {}, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      sessionStorage.removeItem("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      setError("Auth token not found");
      setLoading(false);
      return;
    }
    axios.post("http://127.0.0.1:8000/api/getUserId", { authToken })
      .then(response => fetchTasks(response.data.id))
      .catch(() => {
        setError("Failed to authenticate user");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar with Toggle */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 p-6 bg-gray-900 text-white ${isOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-xl font-bold text-white">Confirm Logout</h2>
            <p className="text-gray-300 mt-2">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Yes</button>
              <button onClick={() => setShowLogoutModal(false)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

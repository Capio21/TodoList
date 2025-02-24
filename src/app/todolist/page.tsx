"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaHome, FaTasks, FaUserAlt, FaSignOutAlt } from "react-icons/fa";

const LogoutButton = () => {
  const router = useRouter();



 
  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        console.error("No token found, redirecting to login.");
        router.push("/login");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      sessionStorage.removeItem("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-500 py-2 px-4 rounded transition flex items-center justify-center"
    >
      <FaSignOutAlt className="mr-2" /> Logout
    </button>
  );
};

export default function TodoPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

 

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-blue-500">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 text-center mb-6">
            📌 Task-Dash
          </h1>
          <nav className="space-y-4">
            <button
              onClick={() => router.push("/todolist")}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition flex items-center"
            >
              <FaHome className="mr-3" /> Dashboard
            </button>
            <button
              onClick={() => router.push("/Taskuser")}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition flex items-center"
            >
              <FaTasks className="mr-3" /> My Tasks
            </button>
            <button
              onClick={() => router.push("/UserProfile")}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition flex items-center"
            >
              <FaUserAlt className="mr-3" /> Profile
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-blue-400">📊 Task Overview</h2>

       
      </div>
    </div>
  );
}

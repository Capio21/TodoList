"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Logout Modal State
  const router = useRouter();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user-stats");
        setUserStats(response.data);
      } catch (err) {
        setError("Failed to load statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Logout Function
  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  // Chart Data
  const data = {
    labels: userStats.map((stat) => stat.month),
    datasets: [
      {
        label: "New Users",
        data: userStats.map((stat) => stat.count),
        backgroundColor: "rgba(0, 153, 255, 0.7)",
        borderColor: "rgba(0, 153, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "New Users Per Month" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <>
      <Head>
        <title>Dashboard | Infi-Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-blue-500">
          <div>
            <h1 className="text-2xl font-bold text-blue-400 text-center mb-6">Infi-Admin</h1>
            <nav className="space-y-4">
              <button
                onClick={() => router.push("/DashBoard")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => router.push("/usertodo")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                ✅ User To-Do List
              </button>
              <button
                onClick={() => router.push("/Userlist")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                👥 User List
              </button>
            </nav>
          </div>

          {/* 🚀 Logout Button (Opens Modal) */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-600 hover:bg-red-500 py-2 px-4 rounded transition mt-6"
          >
            🚪 Logout
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-3xl border border-blue-500">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Dashboard Overview</h2>

            {loading ? (
              <p className="text-center text-gray-300">Loading data...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="w-full">
                <Bar data={data} options={options} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96">
            <h3 className="text-xl font-bold text-center mb-4">Confirm Logout</h3>
            <p className="text-center text-gray-300 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-1/2 bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded transition mr-2"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleLogout}
                className="w-1/2 bg-red-600 hover:bg-red-500 py-2 px-4 rounded transition"
              >
                ✅ Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

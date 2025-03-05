"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Adminbar from "../Components/adminsidebar";
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
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Adminbar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-4xl border border-blue-500">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Dashboard Overview</h2>
          
          {loading ? (
            <p className="text-center text-gray-300">Loading data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="w-full h-[400px] flex justify-center">
              <Bar data={data} options={options} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
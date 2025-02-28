'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHome, FaTasks, FaUserAlt, FaSignOutAlt, FaProjectDiagram } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Activity {
  id: number;
  title: string;
  description?: string;
  date_started: string;
  due_date: string;
  tags?: string;
  status: 'pending' | 'complete' | 'overdue';
  archive: boolean;
}



const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState<Partial<Activity>>({ 
    title: "", 
    description: "", 
    date_started: "", 
    due_date: "", 
    tags: "", 
    status: 'pending', 
    archive: false 
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showArchiveTableModal, setShowArchiveTableModal] = useState(false);
  const [archiveId, setArchiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const router = useRouter();  // Add this line

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_BASE_URL}/activities/${editId}`, formData);
        alert("Activity updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/activities`, formData);
        alert("Activity created successfully!");
      }
      setFormData({ title: "", description: "", date_started: "", due_date: "", tags: "", status: 'pending', archive: false });
      setEditId(null);
      fetchActivities();
    } catch (error: any) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  const handleEdit = (activity: Activity) => {
    setFormData(activity);
    setEditId(activity.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`${API_BASE_URL}/activities/${id}`);
        fetchActivities();
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  const openArchiveModal = (id: number) => {
    setArchiveId(id);
    setShowArchiveModal(true);
  };

  const confirmArchive = async () => {
    if (archiveId !== null) {
      try {
        await axios.put(`${API_BASE_URL}/activities/${archiveId}`, { archive: true });
        setShowArchiveModal(false);
        setArchiveId(null);
        fetchActivities();
      } catch (error) {
        console.error("Error archiving activity:", error);
      }
    }
  };

  const handleMarkAsDone = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/activities/${id}`, { status: 'complete' });
      fetchActivities();
    } catch (error) {
      console.error("Error marking activity as done:", error);
    }
  };
  const restoreActivity = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/activities/${id}`, { archive: false });
      fetchActivities(); // Refresh the list after unarchiving
    } catch (error) {
      console.error("Error restoring activity:", error);
    }
  };

  
  const deleteActivity = async (id: number) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      try {
        await fetch(`/api/activities/${id}`, { method: "DELETE" });
        setActivities(prev => prev.filter(activity => activity.id !== id));
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
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
    {/* Sidebar with Glassmorphism & Depth Effect */}
    <aside className="w-72 bg-gray-800 p-6 flex flex-col justify-between border-r border-blue-500 shadow-2xl backdrop-blur-md bg-opacity-80 rounded-lg">
      <div>
        <h1 className="text-3xl font-bold text-blue-400 text-center mb-6 drop-shadow-lg">
          📌 Task-Dash
        </h1>
        <nav className="space-y-4">
          {[
            { path: "/todolist", label: "Dashboard", icon: <FaHome /> },
            { path: "/Taskuser", label: "My Tasks", icon: <FaTasks /> },
            { path: "/ProjectUser", label: "My Project", icon: <FaProjectDiagram /> },
            { path: "/UserProfile", label: "Profile", icon: <FaUserAlt /> },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center text-left bg-gradient-to-br from-gray-700 to-gray-600 hover:from-blue-700 hover:to-blue-500 py-3 px-4 rounded-xl transition-transform transform hover:scale-105 shadow-md"
            >
              <span className="mr-3">{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 py-3 px-4 rounded-xl shadow-lg transform transition-transform hover:scale-105 flex items-center justify-center"
      >
        <FaSignOutAlt className="mr-2" /> Logout
      </button>
    </aside>

  {/* Main Content */}
<div className="flex-1 p-8 bg-gray-900 text-white">
  <h2 className="text-4xl font-extrabold text-blue-400 mb-6 drop-shadow-xl">
    📊 Task Overview
  </h2>


</div>


    {/* Loader Styles */}
    <style jsx>{`
      .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60vh;
        width: 100%;
      }

      .ball {
        position: relative;
        bottom: 50px;
        left: calc(100% - 20px);
        width: 50px;
        height: 50px;
        background: #fff;
        border-radius: 50%;
        animation: ball-move 0.2s ease-in-out infinite alternate;
        box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
      }

      .bar {
        width: 200px;
        height: 12.5px;
        background: linear-gradient(45deg, #ffdaaf, #ffb347);
        border-radius: 30px;
        transform: rotate(-15deg);
        animation: up-down 0.2s ease-in-out infinite alternate;
      }

      @keyframes up-down {
        from {
          transform: rotate(-15deg);
        }
        to {
          transform: rotate(15deg);
        }
      }

      @keyframes ball-move {
        from {
          left: calc(100% - 40px);
          transform: rotate(360deg);
        }
        to {
          left: calc(0% - 20px);
          transform: rotate(0deg);
        }
      }
    `}</style>
  </div>
);

  
}

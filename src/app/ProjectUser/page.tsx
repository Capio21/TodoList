"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaHome, FaTasks, FaUserAlt, FaSignOutAlt, FaProjectDiagram } from "react-icons/fa";

export default function TodoPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<{ id: number; title: string; description: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      setError("Auth token not found");
      setLoading(false);
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/getUserId", { authToken })
      .then((response) => {
        setUserId(response.data.id);
        fetchTasks(response.data.id);
      })
      .catch(() => {
        setError("Failed to authenticate user");
        setLoading(false);
      });
  }, []);

  const fetchTasks = (userId: number) => {
    axios
      .get(`http://127.0.0.1:8000/api/tasks/${userId}`)
      .then((response) => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch tasks");
        setLoading(false);
      });
  };

  const markAsDone = (taskId: number) => {
    axios
      .patch(`http://127.0.0.1:8000/api/tasks/${taskId}/markAsDone`, { status: "complete" })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, status: "complete" } : task))
        );
      })
      .catch(() => {
        console.error("Failed to mark task as done");
      });
  };


  


  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar Navigation */}
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
      <div className="flex-1 p-8">
        <h2 className="text-4xl font-extrabold text-blue-400 mb-6">📊 Task Overview</h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {tasks.sort((a, b) => a.id - b.id).map((task, index) => {
              const isLocked = index > 0 && tasks[index - 1].status !== "complete";
              return (
                <div
                key={task.id}
                className={`relative border-4 border-black bg-[#696798] p-6 shadow-[10px_10px_0_#000] transition-all hover:translate-x-[-6px] hover:translate-y-[-6px] w-80 rounded-lg ${
                  isLocked ? "opacity-50 blur-sm pointer-events-none" : ""
                } flex flex-col items-center`}
              >
                <div className="bg-white border-b-4 border-black p-4 font-bold text-black text-center w-full">
                  Task Window
                </div>
                
                <div className="p-4 text-black font-semibold text-center flex flex-col items-center space-y-3">
                  <h3 className="text-lg font-bold">{task.title}</h3>
                  <p className="text-sm">{task.description}</p>
                  <div className="text-xs text-gray-800 space-y-2">
                    <p><strong>Start:</strong> {new Date(task.time_started).toLocaleString()}</p>
                    <p><strong>End:</strong> {new Date(task.time_ended).toLocaleString()}</p>
                    <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => markAsDone(task.id)}
                    disabled={task.status === "complete"}
                    className={`w-full py-2 border-4 border-black shadow-[4px_4px_0_#000] font-bold transition-all cursor-pointer mt-4 ${
                      task.status === "complete" ? "bg-green-500" : "bg-blue-600 hover:bg-blue-500"
                    }`}
                  >
                    {task.status === "complete" ? "Completed" : "Mark as Done"}
                  </button>
                </div>
              </div>
              
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
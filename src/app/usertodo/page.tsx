"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import TaskForm from "./form"; // Import TaskForm component
import Archive from "./Archive";
import Adminbar from "../Components/adminsidebar";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: string;
  deadline: string;
  time_started: string;
  time_ended: string;
  time_spent: string;
  progress: string;
  created_at: string;
  updated_at: string;
  archived?: boolean;
  visibility?: string; // Added visibility property
}

export default function Dashboard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;
  const [expandedDescription, setExpandedDescription] = useState(false); // State for read more functionality

  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const currentTask = tasks[currentPage];

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/notArchive`);
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    router.push("/login");
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const archiveTask = async (taskId: number) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/archive`);
      if (response.status === 200) {
        alert("Task archived successfully!");
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setArchivedTasks((prevArchived) => [...prevArchived, response.data]);
      }
    } catch (error) {
      console.error("Error archiving task:", error);
      alert("Failed to archive task.");
    }
  };

  const deleteTask = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const toggleVisibility = async (taskId: number) => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/tasks/${taskId}/toggle-visibility`);
      const updatedTasks = await axios.get(`${API_BASE_URL}/notArchive`);
      setTasks(updatedTasks.data);
    } catch (error) {
      console.error("Error updating visibility:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Head>
        <title>Users List | Infi-Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-gray-900 text-white">
        <Adminbar />
        <div className="container mx-auto p-4">
          <div className="w-full space-y-10 z-40 rounded-lg shadow-lg">
            <div>
              <br />
              <button
                onClick={() => setShowTableModal(true)}
                className="inline-block px-4 py-2 text-xl font-bold text-white bg-green-500 border-2 border-black rounded-lg shadow-[5px_5px_0px_#000] transition-all duration-300 cursor-pointer hover:bg-white hover:text-green-500 hover:border-green-500 hover:shadow-[5px_5px_0px_#4caf50] active:bg-yellow-300 active:shadow-none active:translate-y-1"
              >
                View Task Table
              </button>

              <button
                onClick={() => setShowArchiveModal(true)}
                className="inline-block px-4 py-2 text-xl font-bold text-white bg-blue-500 border-2 border-black rounded-lg shadow-[5px_5px_0px_#000] transition-all duration-300 cursor-pointer hover:bg-white hover:text-blue-500 hover:border-blue-500 hover:shadow-[5px_5px_0px_#2196f3] active:bg-yellow-300 active:shadow-none active:translate-y-1"
              >
                View Archived Tasks
              </button>

              <br />
              <br />
              <TaskForm tasks={tasks} setTasks={setTasks} editingTask={editingTask} setEditingTask={setEditingTask} />
            </div>
          </div>
        </div>

        {showTableModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="relative p-6 rounded-lg border-4 border-blue-900 shadow-lg bg-gray-800 w-full max-w-lg transition-all duration-300"
              style={{ translate: "-6px -6px" }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-extrabold bg-gray-700 px-6 py-3 border-b-4 border-blue-900 text-white rounded-lg shadow-lg">
                  Task Table
                </div>
                <button
                  onClick={() => setShowTableModal(false)}
                  className="text-white bg-red-500 rounded px-4 py-2"
                >
                  Close
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                  {currentTask && (
                    <div
                      key={currentTask.id}
                      className="relative p-4 rounded-lg border-4 border-blue-900 shadow-md bg-gray-700 transition-all duration-300 text-center"
                    >
                      <span
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-md ${
                          currentTask.status === 'done' ? 'bg-green-600' :
                          currentTask.status === 'pending' ? 'bg-yellow-500' :
                          currentTask.status === 'overdue' ? 'bg-red-600' :
                          'bg-gray-500'
                        }`}
                      >
                        {currentTask.status.toUpperCase()}
                      </span>

                      <h4 className="text-lg font-bold text-white">{currentTask.title}</h4>
                      <p className="text-gray-300 text-sm">
                        {expandedDescription ? currentTask.description : `${currentTask.description.substring(0, 100)}...`}
                        {currentTask.description.length > 100 && (
                          <button
                            onClick={() => setExpandedDescription(!expandedDescription)}
                            className="text-blue-400 hover:underline ml-1"
                          >
                            {expandedDescription ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </p>
                      <p className="text-sm text-gray-300"><strong>Deadline:</strong> {currentTask.deadline}</p>
                      <p className="text-sm text-gray-300"><strong>Started:</strong> {currentTask.time_started}</p>
                      <p className="text-sm text-gray-300"><strong>Ended:</strong> {currentTask.time_ended}</p>

                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        <div className="flex flex-1 overflow-hidden">
                          <button
                            onClick={() => editTask(currentTask)}
                            className="py-1 px-3 border-4 border-blue-900 shadow-md bg-green-600 text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_#000] flex-shrink-0"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteTask(currentTask.id)}
                            className="py-1 px-3 border-4 border-blue-900 shadow-md bg-red-600 text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_#000] flex-shrink-0"
                          >
                            🗑️ Delete
                          </button>
                          <button
                            onClick={() => archiveTask(currentTask.id)}
                            className="py-1 px-3 border-4 border-blue-900 shadow-md bg-blue-600 text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_#000] flex-shrink-0"
                          >
                            📦 Archive
                          </button>
                          <button
                            onClick={() => toggleVisibility(currentTask.id)}
                            disabled={loading}
                            className={`py-1 px-3 border-4 border-blue-900 shadow-md ${
                              currentTask.visibility === "visible" ? "bg-green-600" : "bg-gray-500"
                            } text-white transition-all duration-300 flex-shrink-0`}
                          >
                            {currentTask.visibility === "visible" ? "🔵 Visible" : "⚫ Invisible"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {showArchiveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white h-auto ">
              <h3 className="text-xl font-bold text-center mb-4">Archived Tasks</h3>
              <Archive />
              <button onClick={() => setShowArchiveModal(false)} className="w-full bg-red-600 hover:bg-red-500 py-2 px-4 rounded mt-4">Close</button>
            </div>
          </div>
        )}

        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96">
              <h3 className="text-xl font-bold text-center mb-4">Confirm Logout</h3>
              <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-500 py-2 px-4 rounded transition">
                ✅ Logout
              </button>
              <button onClick={() => setShowLogoutModal(false)} className="w-full bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded mt-2">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
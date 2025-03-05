
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import TaskForm from "./form"; // Import TaskForm component
import Archive from "./Archive";
import Adminbar from "../Components/adminsidebar";


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
}

export default function Dashboard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]); // Missing archived tasks state
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);




  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/notArchive")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
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
      const response = await axios.put(
        `http://127.0.0.1:8000/api/tasks/${taskId}/archive`
      );

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
        await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };


  const toggleVisibility = async (taskId: number) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8000/api/tasks/${taskId}/toggle-visibility`);
      axios
      .get("http://127.0.0.1:8000/api/notArchive")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
    } catch (error) {
      console.error("Error updating visibility:", error);
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <>
    <Head>
        <title>Users List | Infi-Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-gray-900 text-white">
      

        {/* Main Content */}

            {/* Button to open task table modal */}
          <Adminbar />
         <div className="container mx-auto p-4">
  <div className="w-full space-y-10 z-40 rounded-lg shadow-lg">
    <div>
      <br />
      <button 
        onClick={() => setShowTableModal(true)} 
        className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md"
      >
        View Task Table
      </button>
      <button
        onClick={() => setShowArchiveModal(true)}
        className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded"
      >
        View Archived Tasks
      </button>
      <br />
      {/* Pass tasks, setTasks, and editTask to TaskForm */}
      <br />
      <br />
      <TaskForm tasks={tasks} setTasks={setTasks} editingTask={editingTask} setEditingTask={setEditingTask} />
    </div>
  </div>
</div>



      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="relative p-6 rounded-lg border-4 border-blue-900 shadow-[10px_10px_0px_#000] bg-gray-800 w-full max-w-6xl transition-all duration-300"
            style={{ translate: "-6px -6px" }}
          >
            <div className="flex justify-center items-center w-full h-20">
              <div className="text-lg font-extrabold bg-gray-700 px-6 py-3 border-b-4 border-blue-900 text-white rounded-lg shadow-lg">
                Task Table
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="relative p-4 rounded-lg border-4 border-blue-900 shadow-[5px_5px_0px_#000] bg-gray-700 transition-all duration-300"
                  style={{ translate: "-4px -4px" }}
                >
                  {/* Task Status Tag */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-md ${
                      task.status === 'done' ? 'bg-green-600' :
                      task.status === 'pending' ? 'bg-yellow-500' :
                      task.status === 'overdue' ? 'bg-red-600' :
                      'bg-gray-500'
                    }`}
                  >
                    {task.status.toUpperCase()}
                  </span>

                  <h4 className="text-lg font-bold text-white">{task.title}</h4>
                  <p className="text-gray-300 text-sm">{task.description}</p>
                  <p className="text-sm text-gray-300"><strong>Deadline:</strong> {task.deadline}</p>
                  <p className="text-sm text-gray-300"><strong>Started:</strong> {task.time_started}</p>
                  <p className="text-sm text-gray-300"><strong>Ended:</strong> {task.time_ended}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => editTask(task)}
                      className="py-1 px-3 border-4 border-blue-900 shadow-[3px_3px_0px_#000] bg-green-600 text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_#000]"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="py-1 px-3 border-4 border-blue-900 shadow-[3px_3px_0px_#000] bg-red-600 text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_#000]"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      onClick={() => archiveTask(task.id)}
                      className="py-1 px-3 border-4 border-blue-900 shadow-[3px_3px_0px_#000] bg-blue-600 text-white transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0px_#000]"
                    >
                      📦 Archive
                    </button>
                    <button
                      onClick={() => toggleVisibility(task.id)}
                      disabled={loading}
                      className={`py-1 px-3 border-4 border-blue-900 shadow-md ${
                        task.visibility === "visible" ? "bg-green-600" : "bg-gray-500"
                      } text-white transition-all duration-300`}
                    >
                      {task.visibility === "visible" ? "🔵 Visible" : "⚫ Invisible"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTableModal(false)}
              className="w-full mt-6 py-2 px-4 border-4 border-black shadow-[5px_5px_0px_#000] bg-red-500 transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000]"
            >
              Close
            </button>
          </div>
        </div>
    )}






   {showArchiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-full max-w-4xl">
            <h3 className="text-xl font-bold text-center mb-4">Archived Tasks</h3>
            <Archive />
            <button onClick={() => setShowArchiveModal(false)} className="w-full bg-red-600 hover:bg-red-500 py-2 px-4 rounded mt-4">Close</button>
          </div>
        </div>
      )}

      

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96">
            <h3 className="text-xl font-bold text-center mb-4">Confirm Logout</h3>
            <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-500 py-2 px-4 rounded transition">
              ✅ Logout
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

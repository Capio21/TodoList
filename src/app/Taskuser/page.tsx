    "use client";

    import { useState, useEffect } from "react";
    import { useRouter } from "next/navigation";
    import axios from "axios";
    import {
        FaHome, FaTasks, FaUserAlt, FaSignOutAlt, FaArchive, FaCheck, FaPlus, FaTrash, FaUndo
    } from "react-icons/fa";
   
    interface Task {
        id: number;
        mytodolist_title: string;
        description?: string;
        time: string;
        date: string;
        status: "pending" | "done" | "overdue";
        archived: boolean;
      }
    

    export default function TodoPage() {
        
        const router = useRouter();
        const API_URL = "http://127.0.0.1:8000/api/tasks";

        const [tasks, setTasks] = useState<Task[]>([]);
        const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
        const [isAddModalOpen, setIsAddModalOpen] = useState(false);
        const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
        const [taskToConfirm, setTaskToConfirm] = useState<number | null>(null);

        const [newTask, setNewTask] = useState({
            mytodolist_title: "",
            description: "",
            date: "",
            time: "",
            
        });

        useEffect(() => {
            fetchTasks();
        }, []);
        const fetchTask = async () => {
            try {
                await axios.get("http://127.0.0.1:8000/api/tasks/check-overdue"); // Trigger overdue check
                const response = await axios.get(API_URL);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        




        
        const fetchTasks = async () => {
            try {
                const response = await axios.get(API_URL);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        
        const markAsDone = async (id: number) => {
            try {
                await axios.put(`${API_URL}/${id}/mark-done`);
                fetchTasks(); // Refresh the tasks after updating
            } catch (error) {
                console.error("Error marking task as done:", error);
            }
        };

        
        
        const addTask = async () => {
            try {
                await axios.post(API_URL, newTask);
                fetchTasks();
                setIsAddModalOpen(false);
                setNewTask({ mytodolist_title: "", description: "", date: "", time: "" });
            } catch (error) {
                console.error("Error adding task:", error);
            }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setNewTask((prevTask) => ({
                ...prevTask,
                [name]: value,
            }));
        };

        const handleSubmit = () => {
            if (!newTask.mytodolist_title || !newTask.description || !newTask.date || !newTask.time) {
                return; // Prevent submission if any field is empty
            }
            addTask();
        };

        const archiveTask = async (id: number) => {
            try {
                await axios.put(`${API_URL}/${id}/archive`);
                fetchTasks();
            } catch (error) {
                console.error("Error archiving task:", error);
            }
        };

        const unarchiveTask = async (id: number) => {
            try {
                await axios.put(`${API_URL}/${id}/unarchive`);
                fetchTasks();
            } catch (error) {
                console.error("Error unarchiving task:", error);
            }
        };

        const deleteTask = async (id: number) => {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchTasks();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        };

        const handleConfirmAction = (action: "archive" | "unarchive" | "delete", id: number) => {
            setTaskToConfirm(id);
            setIsConfirmModalOpen(true);
        };

        const handleConfirm = (action: "archive" | "unarchive" | "delete") => {
            if (taskToConfirm === null) return;

            switch (action) {
                case "archive":
                    archiveTask(taskToConfirm);
                    break;
                case "unarchive":
                    unarchiveTask(taskToConfirm);
                    break;
                case "delete":
                    deleteTask(taskToConfirm);
                    break;
            }

            setIsConfirmModalOpen(false);
            setTaskToConfirm(null);
        };


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
        return (
            <div className="flex min-h-screen bg-[#0a192f] text-white">
                {/* Sidebar */}
                 <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-blue-500">
                        <div>
                          <h1 className="text-2xl font-bold text-blue-400 text-center mb-6">
                            📌 Infini-Task
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
                    <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">📌 My Tasks</h2>

                    {/* Buttons */}
                    <div className="flex gap-4 mb-4">
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded flex items-center">
                            <FaPlus className="mr-2" /> Add Task
                        </button>
                        <button onClick={() => setIsArchiveModalOpen(true)} className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded flex items-center">
                            <FaArchive className="mr-2" /> View Archive
                        </button>
                    </div>

                    {/* Add Task Modal */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-gray-800 p-6 rounded-lg w-1/2">
                                <h2 className="text-xl font-bold text-green-400 mb-4">📝 Add Task</h2>

                                <input
                                    type="text"
                                    placeholder="Title *"
                                    value={newTask.mytodolist_title}
                                    onChange={handleInputChange}
                                    name="mytodolist_title"
                                    className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                                    required
                                />
                                {!newTask.mytodolist_title && <p className="text-red-500 text-sm">Title is required.</p>}

                                <textarea
                                    placeholder="Description *"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    name="description"
                                    className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                                    required
                                />
                                {!newTask.description && <p className="text-red-500 text-sm">Description is required.</p>}

                                <input
                                    type="date"
                                    value={newTask.date}
                                    onChange={handleInputChange}
                                    name="date"
                                    className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                                    required
                                />
                                {!newTask.date && <p className="text-red-500 text-sm">Date is required.</p>}

                                <input
                                    type="time"
                                    value={newTask.time}
                                    onChange={handleInputChange}
                                    name="time"
                                    className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                                    required
                                />
                                {!newTask.time && <p className="text-red-500 text-sm">Time is required.</p>}

                                <button onClick={handleSubmit} className="bg-blue-500 px-4 py-2 rounded mr-2">
                                    Add
                                </button>
                                <button onClick={() => setIsAddModalOpen(false)} className="bg-gray-600 px-4 py-2 rounded">
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Archive Modal */}
                    {isArchiveModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-gray-800 p-6 rounded-lg w-3/4 max-h-[80vh] overflow-auto">
                                <h2 className="text-xl font-bold text-yellow-400 mb-4">📁 Archived Tasks</h2>

                                {tasks.filter(task => task.archived).length === 0 ? (
                                    <p className="text-center text-gray-400">No archived tasks</p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-4">
                                        {tasks.filter(task => task.archived).map((task) => (
                                            <div key={task.id} className="bg-gray-700 border border-blue-500 p-4 rounded-lg shadow-md">
                                                <h3 className="text-lg font-bold text-blue-400">{task.mytodolist_title}</h3>
                                                <p className="text-gray-300">{task.description || "No description"}</p>
                                                <p className="text-gray-400 mt-2">📅 {task.date} ⏰ {task.time}</p>
                                                <p className="mt-2">
                                                    {task.status === "pending" ? "🕒 Pending" : task.status === "done" ? "✅ Done" : "⚠ Overdue"}
                                                </p>
                                                <div className="mt-4 flex justify-between">
                                                    <button onClick={() => unarchiveTask(task.id)} className="bg-green-500 px-3 py-1 rounded">♻ Restore</button>
                                                    <button onClick={() => deleteTask(task.id)} className="bg-red-500 px-3 py-1 rounded">🗑 Delete</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <button onClick={() => setIsArchiveModalOpen(false)} className="bg-gray-600 px-4 py-2 rounded mt-4">Close</button>
                            </div>
                        </div>
                    )}

                    {/* Active Tasks Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        {tasks.filter(task => !task.archived).length === 0 ? (
                            <p className="text-center text-gray-400 col-span-3">No active tasks</p>
                        ) : (
                            tasks.filter(task => !task.archived).map(task => (
                                <div key={task.id} className="bg-gray-800 border border-blue-500 p-4 rounded-lg shadow-md">
                                    <h3 className="text-lg font-bold text-blue-400">{task.mytodolist_title}</h3>
                                    <p className="text-gray-300">{task.description || "No description"}</p>
                                    <p className="text-gray-400 mt-2">📅 {task.date} ⏰ {task.time}</p>
                                    <p className="mt-2">
                                        {task.status === "pending" ? "🕒 Pending" : task.status === "done" ? "✅ Done" : "⚠ Overdue"}
                                    </p>
                                    <div className="mt-4 flex justify-between">
                                        {task.status !== "done" && (
                                            <button onClick={() => markAsDone(task.id)} className="bg-green-500 px-3 py-1 rounded">
                                                ✅ Done
                                            </button>
                                        )}
                                        <button onClick={() => handleConfirmAction("archive", task.id)} className="bg-yellow-500 px-3 py-1 rounded">📦 Archive</button>
                                        <button onClick={() => handleConfirmAction("delete", task.id)} className="bg-red-500 px-3 py-1 rounded">🗑 Delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Confirmation Modal */}
                    {isConfirmModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-gray-800 p-6 rounded-lg w-1/2">
                                <h2 className="text-xl font-bold text-red-400 mb-4">⚠ Are you sure?</h2>
                                <p className="mb-4">Do you really want to proceed with this action?</p>
                                <div className="flex gap-4">
                                    <button onClick={() => handleConfirm("archive")} className="bg-green-600 px-4 py-2 rounded">Yes</button>
                                    <button onClick={() => setIsConfirmModalOpen(false)} className="bg-gray-600 px-4 py-2 rounded">No</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

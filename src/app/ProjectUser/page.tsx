"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../Components/Sidebar";

export default function TodoPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Pagination index

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

  const fetchTasks = (userId) => {
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

  const markAsDone = (taskId) => {
    axios
      .patch(`http://127.0.0.1:8000/api/tasks/${taskId}/markAsDone`, {
        status: "complete",
      })
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: "complete" } : task
          )
        );
      })
      .catch(() => console.error("Failed to mark task as done"));
  };

  const nextPage = () => {
    if (currentPage < tasks.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-blue-400 mb-6">
          📊 Task/Admin
        </h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {tasks.length > 0 && (
              <div className="w-full flex flex-col items-center">
                {tasks.map((task, index) => {
                  if (index !== currentPage) return null; // Show only the current task

                  const previousTaskCompleted =
                    index === 0 || tasks[index - 1]?.status === "complete";

                  return (
                    <div
                      key={task.id}
                      className={`relative border-4 border-black bg-[#811510] p-6 shadow-[10px_10px_0_#000] transition-all w-full md:w-auto rounded-lg flex flex-col items-center ${
                        previousTaskCompleted ? "" : "opacity-50 blur-md"
                      }`}
                    >
                      <div className="bg-white border-b-4 border-black p-4 font-bold text-black text-center w-full">
                        <h3 className="text-lg font-bold">{task.title}</h3>
                      </div>
                      <div className="p-4 text-white text-lg text-center flex flex-col items-center space-y-3">
                        <p className="text-sm">{task.description}</p>
                        <div className="text-xs text-black-800 space-y-2">
                          <p>
                            <strong>Deadline:</strong>{" "}
                            {new Date(task.deadline).toLocaleString()}
                          </p>
                        </div>

                        <button
                          onClick={() => markAsDone(task.id)}
                          disabled={!previousTaskCompleted || task.status === "complete"}
                          className={`w-full py-2 border-4 border-black shadow-[4px_4px_0_#000] font-bold transition-all cursor-pointer mt-4 ${
                            task.status === "complete"
                              ? "bg-green-500"
                              : previousTaskCompleted
                              ? "bg-blue-600 hover:bg-blue-500"
                              : "bg-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {task.status === "complete" ? "Completed" : "Mark as Done"}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Buttons */}
                <div className="flex justify-between mt-6 w-full max-w-md">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-700 border-2 border-black shadow-md font-bold rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    ◀ Previous
                  </button>
                  <span className="text-lg font-semibold">
                    {currentPage + 1} / {tasks.length}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= tasks.length - 1}
                    className="px-4 py-2 bg-gray-700 border-2 border-black shadow-md font-bold rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

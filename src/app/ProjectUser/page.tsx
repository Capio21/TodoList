"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import authUser  from "../utils/authUser";

const TodoPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

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

  const completedTasks = tasks.filter((task) => task.status === "complete").length;
  const percentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  const nextPage = () => {
    if (currentPage < tasks.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setProgress(percentage);
    }, 300); // Simulate animation delay
  }, [percentage]);

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 p-9 flex flex-col items-center">
        <h1 className="text-2xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-gray-500 drop-shadow-lg">
          ADMIN TASK
        </h1>
        {loading ? (
          <p>Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {tasks.length > 0 && (
              <div className="w-full flex flex-col items-center">
                {tasks.map((task, index) => {
                  if (index !== currentPage) return null;
                  const previousTaskCompleted =
                    index === 0 || tasks[index - 1]?.status === "complete";

                  return (
                    <div
                      key={task.id}
                      className={`relative border-2 border-gray-700 bg-gray-800 p-4 shadow-lg transition-all w-full sm:w-9/10 lg:w-3/4 rounded-lg flex items-center space-x-6`}
                    >
                      {/* Left Side - Progress Bar */}
                      <div className="w-40 flex justify-center items-center">
                        <CircularProgressbar
                          value={percentage}
                          text={`${Math.round(percentage)}%`}
                          styles={buildStyles({
                            pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                            textColor: '#fff',
                            trailColor: '#d6d6d6',
                          })}
                        />
                      </div>

                      {/* Right Side - Task Details */}
          <div className="relative flex-1 flex flex-col items-center text-white">
            {/* Task Title */}
            <div className="bg-green-600 border-b-2 border-gray-700 p-2 font-bold text-center w-full">
              <h3 className="text-lg font-bold">{task.title}</h3>
            </div>

            {/* Tags Pinned in Corner */}
            {task.tags && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                {Array.isArray(task.tags) ? task.tags.join(', ') : task.tags}
              </div>
            )}

            {/* Task Details */}
            <div className="p-2 text-sm text-center space-y-2">
              <p className="text-xs">{task.description}</p>
              <p>
                <strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}
              </p>

           {/* Mark as Done Button */}
<button
  onClick={() => markAsDone(task.id)}
  disabled={task.status === "complete"}
  className={`w-full py-2 border-2 border-gray-700 shadow-md font-bold transition-all cursor-pointer mt-2 ${
    task.status === "complete"
      ? "bg-green-500 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-500"
  }`}
>
  {task.status === "complete" ? "Completed" : "Mark as Done"}
</button>

            </div>
          </div>

                    </div>
                  );
                })}
                <div className="flex justify-between mt-4 w-full max-w-md">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-700 border-2 border-gray-500 shadow-md font-bold rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    ◀ Previous
                  </button>
                  <span className="text-lg font-semibold">{currentPage + 1} / {tasks.length}</span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= tasks.length - 1}
                    className="px-4 py-2 bg-gray-700 border-2 border-gray-500 shadow-md font-bold rounded hover:bg-gray-600 disabled:opacity-50"
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
};

export default authUser (TodoPage);
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function TodoPage() {
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
      <div className="flex-1 p-6 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-gray-500 drop-shadow-lg">
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
                      className={`relative border-4 border-gray-700 bg-gray-800 p-6 shadow-lg transition-all w-full md:w-auto rounded-lg flex flex-col items-center ${
                        previousTaskCompleted ? "" : "opacity-50 blur-md"
                      }`}
                    >
                      <div className="bg-green-600 border-b-4 border-gray-700 p-4 font-bold text-white text-center w-full">
                        <h3 className="text-lg font-bold">{task.title}</h3>
                      </div>
                      <div className="p-4 text-white text-lg text-center flex flex-col items-center space-y-3">
                        <p className="text-sm">{task.description}</p>
                        <div className="text-xs text-gray-300 space-y-2">
                          <div className="flex flex-col items-center justify-center h-auto bg-gray-800 text-[#ccc] font-sans">
                            <style>{`
                              @import url('https://fonts.googleapis.com/css2?family=Orbitron&display=swap');
  
                              *, *:before, *:after { box-sizing: border-box; }
  
                              .range {
                                position: relative;
                                background-color: #2A2A2A;
                                width: 400px;
                                height: 25px;
                                transform: skew(30deg);
                                font-family: 'Orbitron', monospace;
                                overflow: hidden;
                                border: 2px solid #32CD32;
                                box-shadow: 0px 0px 10px rgba(50, 205, 50, 0.8);
                              }
  
                              .range::before {
                                content: '';
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: ${progress}%;
                                height: 100%;
                                background-color: #32CD32;
                                z-index: 0;
                                transition: width 1s ease-in-out;
                                animation: glow 1.5s infinite alternate;
                              }
  
                              .range::after {
                                content: '${progress}%';
                                color: #fff;
                                position: absolute;
                                left: 5%;
                                top: 50%;
                                transform: translateY(-50%) skewX(-30deg);
                                font-weight: bold;
                                font-size: 16px;
                                text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
                                z-index: 1;
                              }
  
                              @keyframes glow {
                                0% { box-shadow: 0px 0px 10px rgba(50, 205, 50, 0.5); }
                                50% { box-shadow: 0px 0px 20px rgba(50, 205, 50, 1); }
                                100% { box-shadow: 0px 0px 10px rgba(50, 205, 50, 0.5); }
                              }
                            `}</style>
                            <div className="range"></div>
                          </div>
                          <p>
                            <strong>Deadline :</strong> {new Date(task.deadline).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => markAsDone(task.id)}
                          disabled={!previousTaskCompleted || task.status === "complete"}
                          className={`w-full py-2 border-4 border-gray-700 shadow-md font-bold transition-all cursor-pointer mt-4 ${
                            task.status === "complete"
                              ? "bg-green-500"
                              : previousTaskCompleted
                              ? "bg-green-600 hover:bg-green-500"
                              : "bg-gray-600 cursor-not-allowed"
                          }`}
                        >
                          {task.status === "complete" ? "Completed" : "Mark as Done"}
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between mt-6 w-full max-w-md">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-700 border-2 border-gray-500 shadow-md font-bold rounded hover:bg-gray-600 disabled:opacity-50"
                  >◀ Previous</button>
                  <span className="text-lg font-semibold">{currentPage + 1} / {tasks.length}</span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage >= tasks.length - 1}
                    className="px-4 py-2 bg-gray-700 border-2 border-gray-500 shadow-md font-bold rounded hover:bg-gray-600 disabled:opacity-50"
                  >Next ▶</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}



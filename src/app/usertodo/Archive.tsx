"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface ArchivedTask {
  id: number;
  title: string;
  description: string;
  status: string;
  deadline: string;
  archived: number;
}

export default function Archive() {
  const [archivedTasks, setArchivedTasks] = useState<ArchivedTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const fetchArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/archived-tasks");
      setArchivedTasks(response.data);
    } catch (error) {
      setError("Failed to fetch archived tasks.");
      console.error("Error fetching archived tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const restoreTask = async (taskId: number) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/tasks/restore/${taskId}`);
      if (response.status === 200 && response.data.task.archived === 0) {
        setArchivedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error restoring task:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-full text-white flex flex-col items-center">
  <h2 className="text-2xl font-bold mb-6 text-center">Archived Tasks</h2>
  {loading ? (
    <p className="text-center text-gray-400">Loading archived tasks...</p>
  ) : error ? (
    <p className="text-center text-red-500">{error}</p>
  ) : archivedTasks.length === 0 ? (
    <p className="text-center text-gray-400">No archived tasks found.</p>
  ) : (
    <div className="flex flex-wrap justify-center gap-6 max-w-3xl">
      {archivedTasks.map((task) => (
        <article
          key={task.id}
          className="w-72 bg-blue-900 border-4 border-black shadow-[8px_8px_0_#000] p-4 space-y-2 rounded-md transition-all duration-300 hover:translate-x-[-6px] hover:translate-y-[-6px]"
        >
          <div className="bg-white text-black font-bold px-4 py-2 border-b-4 border-black">
            {task.title}
          </div>
          <p className="text-black font-semibold p-4">{task.description}</p>
          <p className="text-xs text-black px-4">Status: {task.status}</p>
          <p className="text-xs text-black px-4">Deadline: {task.deadline}</p>
          <button
            onClick={() => restoreTask(task.id)}
            className="mt-3 py-2 px-4 bg-green-400 border-4 border-black shadow-[4px_4px_0_#000] text-black font-bold rounded-md transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
          >
            Restore
          </button>
        </article>
      ))}
    </div>
  )}
</div>

  );
}

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTask, setSelectedTask] = useState<ArchivedTask | null>(null);
  const tasksPerPage = 2; // Increased visibility

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const fetchArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://32d7-2001-4451-8712-1800-91e2-26cf-1dd-5068.ngrok-free.app/api/archived-tasks");
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
      const response = await axios.put(`https://32d7-2001-4451-8712-1800-91e2-26cf-1dd-5068.ngrok-free.app/api/tasks/restore/${taskId}`);
      if (response.status === 200 && response.data.task.archived === 0) {
        setArchivedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error restoring task:", error);
    }
  };

  const totalPages = Math.ceil(archivedTasks.length / tasksPerPage);
  const currentTasks = archivedTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  return (
    <section className="p-6 text-center bg-gray-700 text-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-lg font-bold bg-gray-800 p-3 rounded">Archived Tasks</h3>
      {loading ? (
        <p>Loading archived tasks...</p>
      ) : error ? (
        <p>{error}</p>
      ) : archivedTasks.length === 0 ? (
        <p>No archived tasks found.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full border-collapse bg-gray-900 text-white border border-gray-600">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-2 border border-gray-600">ID</th>
                <th className="p-2 border border-gray-600">Title</th>
                <th className="p-2 border border-gray-600">Description</th>
                <th className="p-2 border border-gray-600">Status</th>
                <th className="p-2 border border-gray-600">Deadline</th>
                <th className="p-2 border border-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id} className="bg-gray-700">
                  <td className="p-2 border border-gray-600">{task.id}</td>
                  <td className="p-2 border border-gray-600 cursor-pointer underline" onClick={() => setSelectedTask(task)}>
                    {task.title}
                  </td>
                  <td className="p-2 border border-gray-600">
                    {task.description.length > 50 ? (
                      <span>
                        {task.description.slice(0, 50)}...
                        <button className="text-blue-400 ml-2" onClick={() => setSelectedTask(task)}>Show More</button>
                      </span>
                    ) : (
                      task.description
                    )}
                  </td>
                  <td className="p-2 border border-gray-600">{task.status}</td>
                  <td className="p-2 border border-gray-600">{task.deadline}</td>
                  <td className="p-2 border border-gray-600">
                    <button 
                      onClick={() => restoreTask(task.id)}
                      className="bg-green-600 text-white p-2 rounded hover:bg-green-500">
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
              Previous
            </button>
            <span className="text-lg font-bold">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

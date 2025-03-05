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
  const tasksPerPage = 2;

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

  const totalPages = Math.ceil(archivedTasks.length / tasksPerPage);
  const currentTasks = archivedTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  return (
    <section style={{ padding: "20px", textAlign: "center", backgroundColor: "#808080", color: "black" }}>
      <h3 style={{ color: "black", backgroundColor: "#606060", padding: "10px", borderRadius: "10px", textAlign: "center" }}>Archived Tasks</h3>
      {loading ? (
        <p>Loading archived tasks...</p>
      ) : error ? (
        <p>{error}</p>
      ) : archivedTasks.length === 0 ? (
        <p>No archived tasks found.</p>
      ) : (
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#A9A9A9", color: "black", border: "3px solid #505050" }}>
            <thead>
              <tr style={{ backgroundColor: "#707070" }}>
                <th style={{ padding: "10px", border: "2px solid #505050" }}>ID</th>
                <th style={{ padding: "10px", border: "2px solid #505050" }}>Title</th>
                <th style={{ padding: "10px", border: "2px solid #505050" }}>Description</th>
                <th style={{ padding: "10px", border: "2px solid #505050" }}>Status</th>
                <th style={{ padding: "10px", border: "2px solid #505050" }}>Deadline</th>
                <th style={{ padding: "10px", border: "2px solid #505050" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id} style={{ backgroundColor: "#B0B0B0" }}>
                  <td style={{ padding: "10px", border: "2px solid #505050" }}>{task.id}</td>
                  <td
                    style={{ padding: "10px", border: "2px solid #505050", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => setSelectedTask(task)}
                  >
                    {task.title}
                  </td>
                  <td style={{ padding: "10px", border: "2px solid #505050" }}>{task.description}</td>
                  <td style={{ padding: "10px", border: "2px solid #505050" }}>{task.status}</td>
                  <td style={{ padding: "10px", border: "2px solid #505050" }}>{task.deadline}</td>
                  <td style={{ padding: "10px", border: "2px solid #505050" }}>
                    <button 
                      onClick={() => restoreTask(task.id)}
                      style={{ backgroundColor: "#606060", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", border: "none" }}>
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ margin: "5px", padding: "5px 10px", borderRadius: "5px", backgroundColor: "#606060", color: "white", border: "none", cursor: "pointer" }}>
              Previous
            </button>
            <span style={{ fontSize: "16px", fontWeight: "bold" }}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ margin: "5px", padding: "5px 10px", borderRadius: "5px", backgroundColor: "#606060", color: "white", border: "none", cursor: "pointer" }}>
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

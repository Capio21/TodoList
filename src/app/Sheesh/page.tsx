"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const API_URL = "http://localhost:8000/api/progress"; // Change URL if needed

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const Progress = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const response = await axios.get(API_URL);
    setTasks(response.data);
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await axios.post(API_URL, { title: newTask, completed: false });
    setNewTask("");
    loadTasks();
  };

  const handleToggleTask = async (id: number, completed: boolean) => {
    await axios.put(`${API_URL}/${id}`, { completed: !completed });
    loadTasks();
  };

  const handleDeleteTask = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    loadTasks();
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const percentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-center">Task Progress</h2>

        <div className="w-40 h-40 mx-auto mb-4">
          <CircularProgressbar
            value={percentage}
            text={`${Math.round(percentage)}%`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
              textColor: "#3e98c7",
              trailColor: "#d6d6d6",
            })}
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Add a new task"
          />
          <button
            onClick={handleAddTask}
            className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded"
          >
            Add Task
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between items-center p-2 bg-gray-200 rounded">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                  className="w-4 h-4"
                />
                <span className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.title}
                </span>
              </label>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Progress;

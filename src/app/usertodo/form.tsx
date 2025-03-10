"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

interface User {
  id: number;
  username: string;
}

interface TaskFormData {
  user_id: string;
  title: string;
  description: string;
  time_started: string;
  time_ended: string;
  deadline: string;
  status: "pending" | "canceled" | "complete" | "overdue";
  tags?: string;
  time_spent?: string;
  progress?: string;
}

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
}

const TaskForm: React.FC<{
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}> = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { register, handleSubmit, reset, setValue } = useForm<TaskFormData>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  useEffect(() => {
    if (editingTask) {
      setValue("user_id", editingTask.user_id.toString());
      setValue("title", editingTask.title);
      setValue("description", editingTask.description);
      setValue("time_started", editingTask.time_started);
      setValue("time_ended", editingTask.time_ended);
      setValue("deadline", editingTask.deadline);
      setValue("status", editingTask.status as "pending" | "canceled" | "complete" | "overdue");
      setValue("progress", editingTask.progress);
      setValue("time_spent", editingTask.time_spent);
    }
  }, [editingTask, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      const taskData = {
        ...data,
      };

      if (editingTask) {
        await axios.put(`http://127.0.0.1:8000/api/tasks/${editingTask.id}`, taskData);
        setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)));
        setEditingTask(null);
      } else {
        const response = await axios.post("http://127.0.0.1:8000/api/tasks", taskData);
        setTasks([...tasks, response.data]);
      }

      reset();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-gray-900 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="relative">
          <label htmlFor="user_id" className="block text-gray-300 mb-2">User</label>
          <select id="user_id" {...register("user_id", { required: true })} className="text-gray-900 p-3 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300">
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="title" className="block text-gray-300 mb-2">Title</label>
          <input id="title" type="text" {...register("title", { required: true })} className="text-gray-900 p-3 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" />
        </div>

        <div className="relative">
          <label htmlFor="time_started" className="block text-gray-300 mb-2">Time Started</label>
          <input id="time_started" type="datetime-local" {...register("time_started", { required: true })} className="text-gray-900 p-3 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" />
        </div>

        <div className="relative">
          <label htmlFor="time_ended" className="block text-gray-300 mb-2">Time Ended</label>
          <input id="time_ended" type="datetime-local" {...register("time_ended", { required: true })} className="text-gray-900 p-3 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" />
        </div>

        <div className="relative">
          <label htmlFor="deadline" className="block text-gray-300 mb-2">Deadline</label>
          <input id="deadline" type="datetime-local" {...register("deadline", { required: true })} className="text-gray-900 p-3 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" />
        </div>

        <div className="relative">
          <label htmlFor="status" className="block text-gray-300 mb-2">Status</label>
          <select id="status" {...register("status", { required: true })} className="text-gray-900 p-3 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300">
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
            <option value="complete">Complete</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div className="relative">
          <label htmlFor="tags" className="block text-gray-300 mb-2">Tags</label>
          <input id="tags" type="text" {...register("tags")} className="text-gray-900 p-3 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300" />
        </div>
      </div>

      <div className="relative mt-6">
        <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
        <textarea id="description" {...register("description", { required: true })} className="text-gray-900 p-4 w-full bg-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"></textarea>
      </div>

      <div className="flex gap-6 mt-6 justify-between flex-wrap">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md shadow-md transition duration-300 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Saving..." : editingTask ? "Update Task" : "Submit"}
        </button>

        {editingTask && (
          <button type="button" onClick={cancelEdit} className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-md shadow-md transition duration-300 transform hover:scale-105">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;

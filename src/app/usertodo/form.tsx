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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="user_id" className="block text-white">User</label>
          <select id="user_id" {...register("user_id", { required: true })} className="text-black p-2 w-full bg-gray-700 rounded-md">
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-white">Title</label>
          <input id="title" type="text" {...register("title", { required: true })} className="text-black p-2 w-full bg-gray-700 rounded-md" />
        </div>

        <div>
          <label htmlFor="time_started" className="block text-white">Time Started</label>
          <input id="time_started" type="datetime-local" {...register("time_started", { required: true })} className="text-black p-2 w-full bg-gray-700 rounded-md" />
        </div>

        <div>
          <label htmlFor="time_ended" className="block text-white">Time Ended</label>
          <input id="time_ended" type="datetime-local" {...register("time_ended", { required: true })} className="text-black p-2 w-full bg-gray-700 rounded-md" />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-white">Deadline</label>
          <input id="deadline" type="datetime-local" {...register("deadline", { required: true })} className="text-black p-2 w-full bg-gray-700 rounded-md" />
        </div>

        <div>
          <label htmlFor="status" className="block text-white">Status</label>
          <select id="status" {...register("status", { required: true })} className="text-black p-2 w-full bg-gray-700 rounded-md">
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
            <option value="complete">Complete</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-white">Tags</label>
          <input id="tags" type="text" {...register("tags")} className="text-black p-2 w-full bg-gray-700 rounded-md" />
        </div>

        <div>
          <label htmlFor="progress" className="block text-white">Progress</label>
          <input id="progress" type="text" {...register("progress")} className="text-black p-2 w-full bg-gray-700 rounded-md" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-white">Description</label>
        <textarea id="description" {...register("description", { required: true })} className="text-black p- w-full bg-gray-700 rounded-md"></textarea>
      </div>

      <div className="flex gap-4">
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md w-full md:w-auto" disabled={loading}>
          {loading ? "Saving..." : editingTask ? "Update Task" : "Submit"}
        </button>

        {editingTask && (
          <button type="button" onClick={cancelEdit} className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-md w-full md:w-auto">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;

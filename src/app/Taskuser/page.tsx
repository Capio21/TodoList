"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Sidebar from "../Components/Sidebar";

interface Activity {
  id: number;
  title: string;
  description?: string;
  date_started: string;
  due_date: string;
  tags?: string;
  status: 'pending' | 'complete' | 'overdue';
  archive: boolean;
}

const alarmSound = new Audio("/alarm-sound.mp3");

const playAlarm = () => {
  alarmSound.currentTime = 0;
  alarmSound.play().catch(error => {
    console.error("Error playing alarm sound:", error);
  });
};

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState<Partial<Activity>>({ 
    title: "", 
    description: "", 
    date_started: "", 
    due_date: "", 
    tags: "", 
    status: 'pending', 
    archive: false 
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const router = useRouter();

  const filteredActivities = activities.filter(activity => activity.status === selectedStatus && !activity.archive);
  const archivedActivities = activities.filter(activity => activity.archive);

  const fetchActivities = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        console.error("No authToken found in sessionStorage.");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/activities/${authToken}`);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      filteredActivities.forEach(activity => {
        const activityTime = new Date(activity.due_date);
        if (
          activityTime.getFullYear() === now.getFullYear() &&
          activityTime.getMonth() === now.getMonth() &&
          activityTime.getDate() === now.getDate() &&
          activityTime.getHours() === now.getHours() &&
          activityTime.getMinutes() === now.getMinutes()
        ) {
          playAlarm();
        }
      });
    }, 60000);

    return () => clearInterval(checkAlarms);
  }, [filteredActivities]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        console.error("No authToken found in sessionStorage.");
        return;
      }

      const userResponse = await axios.get(`${API_BASE_URL}/user/${authToken}`);
      const userId = userResponse.data.id;

      if (!userId) {
        console.error("User  ID not found.");
        return;
      }

      const newFormData = { ...formData, user_id: userId };

      if (editId) {
        await axios.put(`${API_BASE_URL}/activities/${editId}`, newFormData);
        alert("Activity updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/activities`, newFormData);
        alert("Activity created successfully!");
      }

      setFormData({ title: "", description: "", date_started: "", due_date: "", tags: "", status: 'pending', archive: false });
      setEditId(null);
      fetchActivities();
    } catch (error: any) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  const handleEdit = (activity: Activity) => {
    setFormData(activity);
    setEditId(activity.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`${API_BASE_URL}/activities/${id}`);
        fetchActivities();
      } catch (error) {
        console.error("Error deleting activity:", error);
      }
    }
  };

  const handleMarkAsDone = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/activities/${id}/done`);
      fetchActivities();
    } catch (error) {
      console.error("Error marking activity as done:", error);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/activities/${id}/archive`);
      fetchActivities();
    } catch (error) {
      console.error("Error archiving activity:", error);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await axios.put(`${API_BASE_URL}/activities/${id}/restore`); // Ensure this endpoint exists in your backend
      fetchActivities();
    } catch (error) {
      console.error("Error restoring activity:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        console.error("No token found, redirecting to login.");
        router.push("/login");
        return;
      }
      await axios.post("http://127.0.0.1:8000/api/logout", {}, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      sessionStorage.removeItem("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 max-h-30 bg-gray-900 text-white flex items-center justify-center p-9">
          <div className="w-full max-w-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-4xl font-extrabold text-blue-400 mb-6 text-center drop-shadow-xl">
              📊 Personal Task
            </h2>
            <button onClick={() => setIsOpen(true)} className="w-full bg-red-800 border-4 border-black shadow-md p-2 font-bold cursor-pointer hover:bg-red-900">
              Add Task +
            </button>
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Activity Management</h2>
              <select onChange={(e) => setSelectedStatus(e.target.value)} className="w-full p-2 border-4 border-black text-black font-bold mb-4 rounded">
                <option value="pending">Pending</option>
                <option value="complete">Complete</option>
                <option value="overdue">Overdue</option>
                <option value="archived">Archived</option>
              </select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(selectedStatus !== "archived" ? filteredActivities : archivedActivities).map(activity => (
                  <div key={activity.id} className="p-4 border-4 border-black bg-gray-900 text-white rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                    <p className="mb-4 text-gray-400">Due: {activity.due_date}</p>
                    <button onClick={() => handleEdit(activity)} className="bg-blue-600 p-2 rounded">Edit</button>
                    {activity.status === 'pending' && !activity.archive && (
                      <button onClick={() => handleMarkAsDone(activity.id)} className="bg-green-600 p-2 rounded ml-2">Mark as Done</button>
                    )}
                    {activity.archive ? (
                      <button onClick={() => handleRestore(activity.id)} className="bg-yellow-600 p-2 rounded ml-2">Restore</button>
                    ) : (
                      <button onClick={() => handleArchive(activity.id)} className="bg-yellow-600 p-2 rounded ml-2">Archive</button>
                    )}
                    <button onClick={() => handleDelete(activity.id)} className="bg-red-600 p-2 rounded ml-2">Delete</button>
                  </div>
                ))}
              </div>
            </div>
            {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                <div className="bg-red-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-white font-bold text-xl">×</button>
                  <h2 className="text-lg font-bold mb-4">{editId ? "Edit" : "Add"} Activity</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border-4 border-black p-2 bg-gray-200 text-black rounded shadow-md" required />
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border-4 border-black p-2 bg-gray-200 text-black rounded shadow-md"></textarea>
                    <input type="date" name="date_started" value={formData.date_started} onChange={handleChange} className="w-full border-4 border-black p-2 bg-gray-200 text-black rounded shadow-md" required />
                    <input type="datetime-local" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full border-4 border-black p-2 bg-gray-200 text-black rounded shadow-md" required />
                    <input type="text" name="tags" placeholder="Tags" value={formData.tags} onChange={handleChange} className="w-full border-4 border-black p-2 bg-gray-200 text-black rounded shadow-md" />
                    <button type="submit" className="w-full bg-blue-800 border-4 border-black shadow-md p-2 font-bold cursor-pointer hover:bg-blue-900">{editId ? "Update" : "Add"} Activity</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
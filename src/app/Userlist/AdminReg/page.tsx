"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Adminbar from "@/app/Components/adminsidebar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AdminUser {
  id: number;
  username: string;
  email: string;
  profile_image?: string;
}

export default function Dashboard() {
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: null as File | null,
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    fetchAdmins();
    fetchUserStats();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admins");
      setAdmins(response.data);
    } catch (error: any) {
      setError(error.message || "Error fetching admins");
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user-stats");
      setUserStats(response.data);
    } catch (err) {
      setError("Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword") {
      setPasswordError(value !== formData.password ? "Passwords do not match" : "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, profile_image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const form = new FormData();
    form.append("username", formData.username);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("password_confirmation", formData.confirmPassword);
    if (formData.profile_image) {
      form.append("profile_image", formData.profile_image);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/Adminregister", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchAdmins();
      setFormData({ username: "", email: "", password: "", confirmPassword: "", profile_image: null });
    } catch (error: any) {
      setError(error.response?.data || "Error registering admin");
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-gray-900 text-white">
        <Adminbar />

        <div className="flex-1 p-6">
          <h3 className="text-2xl font-bold text-red-500">Register Admin</h3>

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-2 gap-4">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="p-2 border rounded" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="p-2 border rounded" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="p-2 border rounded" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="p-2 border rounded" />
            {passwordError && <p className="text-red-500 col-span-2">{passwordError}</p>}
            <input type="file" onChange={handleFileChange} className="p-2 border rounded col-span-2" />
            <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded col-span-2">Register</button>
          </form>

          <h3 style={{ marginTop: "24px", fontSize: "1.25rem", fontWeight: "600" }}>Admin List</h3>
<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginTop: "16px" }}>
  {admins.map((admin) => (
    <div key={admin.id} style={{ padding: "16px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#1F2937" }}>
      <h4 style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{admin.username}</h4>
      <p>{admin.email}</p>
      {admin.profile_image ? (
        <img src={`http://127.0.0.1:8000/${admin.profile_image}`} alt="Profile" style={{ width: "64px", height: "64px", borderRadius: "50%", marginTop: "8px" }} />
      ) : (
        <p style={{ color: "#9CA3AF" }}>No Image</p>
      )}
    </div>
  ))}
</div>

        </div>
      </div>
    </>
  );
}

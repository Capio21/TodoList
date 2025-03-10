"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import Adminbar from "@/app/Components/adminsidebar";

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
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
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

  const deleteAdmin = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/admins/${adminToDelete}`);
      console.log(response.data);
      fetchAdmins();  // Refresh the admin list after deletion
      setConfirmDeleteModal(false);  // Close the modal
    } catch (error) {
      console.error("There was an error deleting the admin:", error);
      setError("Failed to delete the admin.");
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
      setShowModal(false); // Close the modal after successful registration
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

      <div className="flex min-h-screen bg-gray-800 text-white">
        <Adminbar />

        <div className="flex-1 p-6">
          <h3 className="text-2xl font-bold text-green-500">Admin Dashboard</h3>

          {/* Button to open the modal */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white py-2 px-4 rounded mt-4"
          >
            Register Admin
          </button>

          {/* Modal for the registration form */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-gray-900 p-6 rounded-lg w-96">
                <h3 className="text-2xl font-bold text-green-500 text-center">Register Admin</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-600 rounded text-gray-800"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-600 rounded text-gray-800"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-600 rounded text-gray-800"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-600 rounded text-gray-800"
                  />
                  {passwordError && <p className="text-red-500">{passwordError}</p>}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-600 rounded"
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded mt-2"
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}

          <h3 className="mt-8 text-xl font-semibold">Admin List</h3>
          <div className="grid grid-cols-2 gap-6 mt-6">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-9 border border-green-700 rounded-lg bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h4 className="text-2xl font-bold text-center text-white">{admin.username}</h4>
                {admin.profile_image ? (
                  <div className="flex justify-center mt-4">
                    <img
                      src={`http://127.0.0.1:8000/${admin.profile_image}`}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center mt-4">
                    <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center">
                      <p className="text-gray-300">No Image</p>
                    </div>
                  </div>
                )}
                <p className="mt-4 text-center text-gray-400">{admin.email}</p>
                <button
                  onClick={() => {
                    setAdminToDelete(admin.id);
                    setConfirmDeleteModal(true);
                  }}
                  className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded"
                >
                  Delete Admin
                </button>
              </div>
            ))}
          </div>

          {/* Confirmation Modal for Deletion */}
          {confirmDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-gray-900 p-6 rounded-lg w-96 text-center">
                <h3 className="text-xl font-bold text-white">Are you sure you want to delete this admin?</h3>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={deleteAdmin}
                    className="bg-red-600 text-white py-2 px-4 rounded"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteModal(false)}
                    className="bg-gray-600 text-white py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

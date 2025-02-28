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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
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
    } catch (error) {
      console.error("Error fetching admins:", error);
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
      console.error("Error registering admin:", error.response?.data || error);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <>


<Head>
        <title>Users List | Infi-Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-gray-900 text-white">
        <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-blue-900">
          <div>
            <h1 className="text-2xl font-bold text-blue-400 text-center mb-6">
              Infi-Admin
            </h1>
            <nav className="space-y-4">
              <button
                onClick={() => router.push("/DashBoard")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => router.push("/usertodo")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                ✅ User To-Do List
              </button>
              <button
                onClick={() => router.push("/Userlist")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                👥 User List
              </button>
              <button
                onClick={() => router.push("/Userlist/AdminReg")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                🛠️ Admin Register
              </button>
              
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition mt-4"
          >
            🚪 Logout
          </button>

        
        </aside>
    
        <div className="flex-1 flex items-center justify-center">
            {/* Modal for Table */}
            {showModal && (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-100 z-10">
    <div className="bg-[#0A192F] p-4 rounded-lg shadow-lg max-w-4xl w-full border border-gray-600 flex flex-col relative">
      
      {/* Browser Header */}
      <div className="flex items-center justify-between bg-[#112240] px-4 py-2 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center bg-gray-800 px-3 py-1 rounded-md shadow-md border border-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 0 1 4 4c0 .93-.32 1.78-.86 2.47l3.69 3.69a1 1 0 0 1-1.42 1.42l-3.69-3.69A4 4 0 1 1 8 4zM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="ml-2 bg-transparent outline-none text-sm text-gray-300"
            placeholder="uiverse.io"
          />
        </div>
        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-200 text-lg">✖️</button>
      </div>

      {/* <div className="p-6 bg-gray-900 min-h-full text-white flex flex-col items-center">
  <h2 className="text-2xl font-bold mb-6 text-center">Admin List</h2>

  <div className="grid grid-cols-2 gap-6">
    {admins.map((admin: any) => (
      <div
        key={admin.id}
        className="bg-blue-900 border-4 border-black shadow-[8px_8px_0_#000] p-4 rounded-md transition-all duration-300 hover:translate-x-[-6px] hover:translate-y-[-6px] flex flex-col items-center text-center"
      >
        <div className="bg-white text-black font-bold px-4 py-2 border-b-4 border-black w-full text-center">
          {admin.username}
        </div>
        <p className="text-black font-semibold p-4">{admin.email}</p>

        <div className="mt-2 flex items-center justify-center">
          {admin.profile_image ? (
            <img
              src={`http://127.0.0.1:8000/${admin.profile_image}`}
              alt="Profile"
              className="w-16 h-16 object-cover border-4 border-black shadow-[4px_4px_0_#000] rounded-full"
            />
          ) : (
            <span className="text-black font-bold">No Image</span>
          )}
        </div>
      </div>
    ))}
  </div>
</div> */}

    </div>
  </div>
)}




            {/* Logout Modal */}
            {showLogoutModal && (
              <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <h3 className="text-2xl font-bold text-center text-white mb-4">Are you sure you want to logout?</h3>
                  <div className="flex justify-between">
                    <button onClick={() => setShowLogoutModal(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
                  </div>
                </div>
              </div>
            )}

<div className="flex min-h-screen bg-[#001925] text-white gap-8 px-4 py-8">
  {/* Admin Registration Form (Left Side) */}
  <div className="w-3/4 max-h-screen mx-auto p-8 border-r-4 border-blue-900 bg-[#001925] text-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] relative">
    {/* Form Header */}
    <h3 className="text-3xl font-extrabold text-blue-900 mb-6 text-center drop-shadow-[2px_2px_5px_rgba(0,0,0,0.7)]">
      Register Admin
    </h3>

    {/* Form Container */}
    <div className="bg-[#002733] p-6 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Username */}
        <div className="col-span-1">
          <label className="block text-gray-300 text-sm font-semibold mb-2">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#171818] border border-gray-600 text-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
          />
        </div>

        {/* Email */}
        <div className="col-span-1">
          <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#171818] border border-gray-600 text-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
          />
        </div>

        {/* Password */}
        <div className="col-span-1">
          <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#171818] border border-gray-600 text-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
          />
        </div>

        {/* Confirm Password */}
        <div className="col-span-1">
          <label className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#171818] border border-gray-600 text-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-900 transition-all"
          />
          {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
        </div>

        {/* Profile Image */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <label className="block text-gray-300 text-sm font-semibold mb-2">Upload Profile Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 bg-[#171818] text-gray-300 border border-gray-600 rounded-lg shadow-inner"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-b from-blue-500 to-blue-700 text-[#001925] py-3 rounded-lg font-bold shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.5)] hover:translate-y-[-2px] transition-all"
          >
            Register Admin
          </button>
        
        </div>
      </form>
    </div>
  </div>

  {/* Admin List Sidebar (Right Side - Smaller) */}
  <div className="w-1/4 p-6 bg-gray-900 border-l-4 border-gray-700 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
    <h2 className="text-lg font-bold mb-4 text-center text-white">Admin List</h2>

    <div className="grid grid-cols-1 gap-4 w-full">
      {admins.map((admin: any) => (
        <div
          key={admin.id}
          className="bg-blue-900 border-2 border-black shadow-[4px_4px_0_#000] p-3 rounded-md transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] flex flex-col items-center text-center"
        >
          <div className="bg-white text-black font-bold text-xs px-3 py-1 border-b-2 border-black w-full text-center">
            {admin.username}
          </div>
          <p className="text-white text-xs font-semibold p-2">{admin.email}</p>

          <div className="mt-1 flex items-center justify-center">
            {admin.profile_image ? (
              <img
                src={`http://127.0.0.1:8000/${admin.profile_image}`}
                alt="Profile"
                className="w-12 h-12 object-cover border-2 border-black shadow-[2px_2px_0_#000] rounded-full"
              />
            ) : (
              <span className="text-white text-xs font-bold">No Image</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>






        </div>
      </div>
    </>
  );
}

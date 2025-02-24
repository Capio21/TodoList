"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaHome, FaTasks, FaUserAlt, FaSignOutAlt, FaEdit, FaSave } from "react-icons/fa";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        console.error("No token found, redirecting to login.");
        router.push("/login");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      sessionStorage.removeItem("authToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-500 py-2 px-4 rounded transition flex items-center justify-center"
    >
      <FaSignOutAlt className="mr-2" /> Logout
    </button>
  );
};

export default function TodoPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");

    if (!authToken) {
      router.push("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        setUser(response.data.user);
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        router.push("/login");
      });
  }, [router]);

  const handleSave = async () => {
    try {
      const authToken = sessionStorage.getItem("authToken");
      if (!authToken) {
        console.error("No token found.");
        return;
      }

      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await axios.post("http://127.0.0.1:8000/api/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.user);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Formats to a readable format
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-blue-500">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 text-center mb-6">📌 Infi-Profile</h1>
          <nav className="space-y-4">
            <button
              onClick={() => router.push("/todolist")}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition flex items-center"
            >
              <FaHome className="mr-3" /> Dashboard
            </button>
            <button
              onClick={() => router.push("/Taskuser")}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition flex items-center"
            >
              <FaTasks className="mr-3" /> My Tasks
            </button>
            <button
              onClick={() => router.push("/UserProfile")}
              className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition flex items-center"
            >
              <FaUserAlt className="mr-3" /> Profile
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700 w-full max-w-2xl text-center">
          <h2 className="text-5xl font-extrabold text-blue-400 mb-6">📊 User Profile</h2>
          {user ? (
            <div className="space-y-6">
              {user.profile_image && (
                <img
                  src={`http://127.0.0.1:8000/${user.profile_image}`}
                  alt="Profile"
                  className="w-40 h-40 mx-auto rounded-full border-4 border-blue-400"
                />
              )}
              {editing ? (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                  <input
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                  />
                  <button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-500 py-2 px-4 rounded transition flex items-center justify-center">
                    <FaSave className="mr-2" /> Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold">{user.username}</p>
                  <p className="text-gray-400 text-xl">{user.email}</p>
                  <table className="w-full border-collapse border border-gray-600 mt-4">
                    <thead>
                      <tr>
                        <th className="border border-gray-600 px-4 py-2">Created At</th>
                        <th className="border border-gray-600 px-4 py-2">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-600 px-4 py-2">{formatDateTime(user.created_at)}</td>
                        <td className="border border-gray-600 px-4 py-2">{formatDateTime(user.updated_at)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button onClick={() => setEditing(true)} className="w-full bg-yellow-600 hover:bg-yellow-500 py-2 px-4 rounded transition flex items-center justify-center">
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-400 mt-4 text-lg">Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
}

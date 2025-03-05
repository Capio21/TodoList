"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaHome, FaTasks, FaUserAlt, FaSignOutAlt, FaEdit, FaSave } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";


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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);

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



  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Example: Remove token
    router.push("/login"); // Redirect user to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
    
       <Sidebar/>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-red-900 p-8 rounded-lg shadow-lg border border-gray-900   w-full max-w-2xl text-center">
          <h2 className="text-5xl font-extrabold text-blue-400 mb-6">📊 User Profile</h2>
          {loading ? (
          <div className="loadingspinner">
            <div id="square1"></div>
            <div id="square2"></div>
            <div id="square3"></div>
            <div id="square4"></div>
            <div id="square5"></div>
          </div>
      ) 
        : user ? (
            <div className="space-y-6 bg-[#2e2c45] p-6 rounded-2xl shadow-xl shadow-black border border-red-700">
              {user.profile_image && (
                <div className="relative w-40 h-40 mx-auto rounded-full border-4 border-gray-500 shadow-lg overflow-hidden hover:border-red-500 transition-all">
                  <img
                    src={`http://127.0.0.1:8000/${user.profile_image}`}
                    alt="Profile"
                    className="w-full h-full object-cover transition-all transform hover:scale-105"
                  />
                </div>
              )}
              {editing ? (
                <>
                  <input type="text" value={user.username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 rounded-lg bg-[#475569] text-white border border-red-600 shadow-inner focus:ring focus:ring-blue-500" />
                  <input type="email" value={user.email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-[#475569] text-white border border-red-600 shadow-inner focus:ring focus:ring-blue-500" />
                  <input type="file" onChange={(e) => setProfileImage(e.target.files[0])} className="w-full p-3 rounded-lg bg-[#475569] text-white border border-red-600 shadow-inner" />
                  <button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-500 py-2 px-4 rounded-lg shadow-md active:shadow-sm active:translate-y-1 transition flex items-center justify-center">
                    <FaSave className="mr-2" /> Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-[#CBD5E1]">{user.username}</p>
                  <p className="text-gray-400 text-xl">{user.email}</p>
                  <table className="w-full border-collapse border border-red-600 mt-4 rounded-lg overflow-hidden shadow-lg bg-[#334155]">
                    <thead>
                      <tr className="bg-[#475569]">
                        <th className="border border-red-600 px-4 py-2">Created At</th>
                        <th className="border border-red-600 px-4 py-2">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-600 transition">
                        <td className="border border-gray-600 px-4 py-2">{formatDateTime(user.created_at)}</td>
                        <td className="border border-gray-600 px-4 py-2">{formatDateTime(user.updated_at)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button onClick={() => setEditing(true)} className="w-full bg-red-900 hover:bg-red-500 py-2 px-4 rounded-lg shadow-md active:shadow-sm active:translate-y-1 transition flex items-center justify-center">
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

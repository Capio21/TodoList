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
      
     
      <div className="flex min-h-auto bg-gray-900 text-white">
      
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col items-center">
      <div className="container lg:w-3/6 xl:w-2/4 sm:w-full md:w-3/4 bg-gray-400 shadow-lg transform duration-200 ease-in-out p-6 rounded-lg">
        <div className="h-48 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Cover"
          />
        </div>
        <div className="flex justify-center px-5 -mt-20">
          {user?.profile_image && (
            <img
              className="h-40 w-40 bg-white p-3 rounded-full border-4 border-gray-500 shadow-lg"
              src={`http://127.0.0.1:8000/${user.profile_image}`}
              alt="Profile"
            />
          )}
        </div>
        <div className="text-center px-20 py-6">
          {loading ? (
            <p className="text-gray-400 mt-4 text-xl">Loading user data...</p>
          ) : editing ? (
            <>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-200 text-black border border-gray-400 shadow-inner focus:ring focus:ring-blue-500 text-lg"
                placeholder="Username"
              />
              <input
                type="email"
                value={user.email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 mt-3 rounded-lg bg-gray-200 text-black border border-gray-400 shadow-inner focus:ring focus:ring-blue-500 text-lg"
                placeholder="Email"
              />
              <input
                type="file"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="w-full p-4 mt-3 rounded-lg bg-gray-200 text-black border border-gray-400 shadow-inner text-lg"
              />
              <button
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-500 py-3 px-5 rounded-lg shadow-md mt-4 flex items-center justify-center text-lg"
              >
                <FaSave className="mr-2" /> Save
              </button>
            </>
          ) : (
            <>
              <h2 className="text-gray-800 text-4xl font-bold">{user.username}</h2>
              <p className="text-gray-500 mt-2 text-xl">{user.email}</p>
  
              <hr className="mt-5 border-gray-300" />
              <div className="flex bg-gray-50 mt-4">
                <div className="text-center w-1/2 p-5 hover:bg-gray-100 cursor-pointer text-lg">
                  <p className="text-gray-500">Joined: {formatDateTime(user.created_at)}</p>
                </div>
                <div className="border"></div>
                <div className="text-center w-1/2 p-5 hover:bg-gray-100 cursor-pointer text-lg">
                  <p className="text-gray-500">Last updated: {formatDateTime(user.updated_at)}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-red-600 hover:bg-red-500 py-3 px-5 rounded-lg shadow-md mt-5 flex items-center justify-center text-lg"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
  
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaSignOutAlt, FaEdit, FaSave } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";

export default function TodoPage() {
  const router = useRouter();
  const [user, setUser ] = useState(null);
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
        setUser (response.data.user);
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

      const response = await axios.post(
        "http://127.0.0.1:8000/api/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser (response.data.user);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-800 items-center justify-center p-0.1">
      <Sidebar />
      <div className="flex-1 p-6 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
          User Profile
        </h1>

        <br />
        {/* Main Content Wrapper */}
        <div className="container max-w-6xl w-full flex flex-col lg:flex-row gap-6">
          
          {/* Left Card - Profile Image & Name */}
          <div className="bg-gray-200 p-10 rounded-3xl border border-green-600 shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center w-full lg:w-1/3">
            <div className="h-52 w-52 overflow-hidden rounded-full border-4 border-green-600 shadow-2xl">
              {user?.profile_image ? (
                <img
                  className="w-full h-full object-cover"
                  src={`http://127.0.0.1:8000/${user.profile_image}`}
                  alt="Profile"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-600">
                  No Image
                </div>
              )}
            </div>
            <h2 className="text-gray-800 text-3xl font-bold mt-4 drop-shadow-lg">{user?.username}</h2>
            <br />
            <br />
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-green-500 hover:bg-green-400 py-3 px-5 rounded-lg shadow-xl mt-5 flex items-center justify-center text-lg transition-transform transform hover:scale-105"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </div>
  
          {/* Right Card - User Details */}
          <div className="bg-gray-300 p-8 rounded-3xl border border-green-600 shadow-2xl w-full lg:w-2/3 transform hover:scale-105 transition-all duration-300">
            
            {/* Cover Image */}
            <div className="h-60 overflow-hidden rounded-lg shadow-xl">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1605379399642-870262d3d051?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                alt="Cover"
              />
            </div>
  
            {/* User Details & Actions */}
            <div className="text-center px-6 py-6">
              {loading ? (
                <p className="text-gray-600 mt-4 text-xl">Loading user data...</p>
              ) : editing ? (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 rounded-lg bg-gray-200 text-gray-800 border border-green-600 shadow-inner focus:ring focus:ring-green-500 text-lg"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 mt-3 rounded-lg bg-gray-200 text-gray-800 border border-green-600 shadow-inner focus:ring focus:ring-green-500 text-lg"
                    placeholder="Email"
                  />
                  <input
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="w-full p-4 mt-3 rounded-lg bg-gray-200 text-gray-800 border border-green-600 shadow-inner text-lg"
                  />
                  <button
                    onClick={handleSave}
                    className="w-full bg-green-500 hover:bg-green-400 py-3 px-5 rounded-lg shadow-xl mt-4 flex items-center justify-center text-lg transform hover:scale-105"
                  >
                    <FaSave className="mr-2" /> Save
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mt-2 text-xl">{user?.email}</p>
                  <hr className="mt-5 border-green-600" />
                  <div className="flex bg-gray-200 mt-4 rounded-lg border border-green-600 shadow-xl">
                    <div className="text-center w-1/2 p-5 hover:bg-gray-300 cursor-pointer text-lg">
                      <p className="text-gray-600">Joined: {formatDateTime(user?.created_at)}</p>
                    </div>
                    <div className="border border-green-600"></div>
                    <div className="text-center w-1/2 p-5 hover:bg-gray-300 cursor-pointer text-lg">
                      <p className="text-gray-600">Last updated: {formatDateTime(user?.updated_at)}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
);
}
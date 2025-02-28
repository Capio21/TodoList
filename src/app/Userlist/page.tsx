"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` },
      });
      if (response.data) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };


  
  const handleEditUser = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setEditUsername(user.username || "");
    setEditEmail(user.email || "");
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
  
    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${selectedUser.id}`, {
        username: editUsername,
        email: editEmail,
      });
  
      setShowEditModal(false);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  const handleDeleteUser = async (userId) => {
    if (!userId) return;
  
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return;
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
      fetchUsers(); // Refresh user list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    router.push("/login");
  };



  return (
    <>
      <Head>
        <title>Users List | Infi-Admin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex min-h-screen bg-gray-900 text-white">
        <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between border-r border-blue-500">
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

        <div className="flex-1 flex flex-col items-center p-10">
  <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
    User List
  </h2>

  {loading ? (
    <p className="text-center text-gray-300 text-lg">Loading users...</p>
  ) : error ? (
    <p className="text-center text-red-500 text-lg">{error}</p>
  ) : (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              className="w-80 p-5 bg-gray-700 bg-opacity-50 border-b-8 border-white border-opacity-40 rounded-xl shadow-2xl backdrop-blur-lg transform hover:scale-105 transition-transform duration-300"
              key={user.id}
            >
              {/* Browser Style Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-t-xl shadow-md">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full shadow"></span>
                  <span className="w-3 h-3 bg-yellow-400 rounded-full shadow"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full shadow"></span>
                </div>
                <div className="text-white text-sm font-medium">Inifini.user</div>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4 p-4">
                <img
                  src={user.profile_image ? `http://127.0.0.1:8000/${user.profile_image}` : "/default-profile.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <h3 className="text-lg font-semibold text-white drop-shadow">
                  {user.username}
                </h3>
              </div>

              <p className="text-gray-300 mb-4 px-4">📧 {user.email}</p>

              {/* Buttons */}
              <div className="flex justify-around px-4">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-5 rounded-lg shadow-lg transform transition-all hover:translate-y-[1px]"
                >
                  📝 Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-600 hover:bg-red-500 text-white py-2 px-5 rounded-lg shadow-lg transform transition-all hover:translate-y-[1px]"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 py-4 col-span-full">
            No users found.
          </div>
        )}
      </div>
    </div>
  )}
</div>

      </div>

      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-96">
            <h3 className="text-xl font-bold text-center mb-4">Edit User</h3>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-700 rounded"
            />
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-700 rounded"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowEditModal(false)}
                className="w-1/2 bg-gray-600 hover:bg-gray-500 py-2 px-4 rounded transition mr-2"
              >
                ❌ Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="w-1/2 bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded transition"
              >
                ✅ Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

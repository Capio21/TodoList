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
  const [expandedUserId, setExpandedUserId] = useState(null); // State to manage accordion expansion

  const router = useRouter();


  

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users");
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
    setSelectedUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
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
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) return;

    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleLogout = () => {
    if (sessionStorage.getItem("authToken")) {
      sessionStorage.removeItem("authToken");
      router.push("/login");
    }
  };

  const toggleAccordion = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
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
                onClick={() => router.push("/UserList")}
                className="w-full text-left bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded transition"
              >
                👥 User List
              </button>
            </nav>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition mt-4"
          >
            🚪 Logout
          </button>
        </aside>

        <div className="flex-1 flex flex-col items-center p-10">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            User List
          </h2>

          {loading ? (
            <p className="text-center text-gray-300 text-lg">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-500 text-lg">{error}</p>
          ) : (
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-gray-800 rounded-xl shadow-xl overflow-hidden cursor-pointer"
                      onClick={() => toggleAccordion(user.id)}
                    >
                      <div className="flex justify-between p-6 bg-gray-700">
                        <div className="flex items-center space-x-4">
                          <img
                            src={`http://127.0.0.1:8000/${user.profile_image}` || "/default-profile.png"}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <h3 className="text-xl font-semibold text-gray-300">
                            {user.username}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center text-white">
                          <div
                            className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                            title="Open Folder"
                          >
                            📂
                          </div>
                        </div>
                      </div>

                      {/* Accordion Content */}
                      {expandedUserId === user.id && (
                        <div className="p-6 bg-gray-800 border-t border-gray-700">
                          <p className="text-gray-300 mb-4">Email: {user.email}</p>
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-blue-500 hover:bg-blue-400 py-2 px-4 rounded transition"
                            >
                              📝 Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-500 py-2 px-4 rounded transition"
                            >
                              ❌ Delete
                            </button>
                          </div>
                        </div>
                      )}
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

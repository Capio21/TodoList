"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import Adminbar from "../Components/adminsidebar";
import { FiMoreVertical } from "react-icons/fi";

const EditModal = ({ isOpen, onClose, onUpdate, username, setUsername, email, setEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          />
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 bg-gray-300 p-2 rounded">Cancel</button>
          <button onClick={onUpdate} className="bg-blue-500 text-white p-2 rounded">Update</button>
        </div>
      </div>
    </div>
  );
};

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser , setSelectedUser ] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(null);

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

  const handleEditUser  = (user) => {
    if (!user) return;
    setSelectedUser (user);
    setEditUsername(user.username || "");
    setEditEmail(user.email || "");
    setShowEditModal(true);
  };

  const handleUpdateUser  = async () => {
    if (!selectedUser ) return;

    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${selectedUser .id}`, {
        username: editUsername,
        email: editEmail,
      });

      setShowEditModal(false);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser  = async (userId) => {
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
        <Adminbar />

        <div className="flex-1 flex flex-col items-center p-10">
          <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
            User List
          </h2>

          {loading ? (
            <p className="text-center text-gray-300 text-lg">Loading users...</p>
          ) : error ? (
            <p className="text-center text-red-500 text-lg">{error}</p>
          ) : (
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
              {users.length > 0 ? (
                users.map((user) => (
                  <div
                    className="relative w-full p-5 bg-gray-700 bg-opacity-50 border border-gray-500 rounded-xl shadow-lg"
                    key={user.id}
                  >
                    {/* Profile Image */}
                    <div className="flex flex-col items-center">
                      <img
                        src={user.profile_image ? `http://127.0.0.1:8000/${user.profile_image}` : "/default-profile.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <h3 className="mt-3 text-lg font-semibold text-white">{user.username}</h3>
                    </div>

                    <p className="text-gray-300 text-center mt-2">📧 {user.email}</p>

                    {/* Action Button with Ellipsis */}
                    <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}>
                      <FiMoreVertical size={24} />
                    </div>
                    {menuOpen === user.id && (
                      <div className="absolute top-10 right-4 bg-gray-800 shadow-md rounded-lg overflow-hidden w-32 z-10">
                        <button
                          onClick={() => handleEditUser (user)}
                          className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                        >
                          📝 Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser (user.id)}
                          className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-700"
                        >
                          ❌ Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4 col-span-full">No users found.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateUser }
        username={editUsername}
        setUsername={setEditUsername}
        email={editEmail}
        setEmail={setEditEmail}
      />
    </>
  );
}
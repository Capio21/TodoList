"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdminWarning, setShowAdminWarning] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        sessionStorage.setItem("authToken", response.data.token);
        router.push("/todolist");
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Login failed. Please check your credentials.");
    }

    setLoading(false);
  };

  const handleAdminLogin = () => {
    setShowAdminWarning(true);
    setTimeout(() => setShowAdminWarning(false), 3000); // Hide after 3 seconds
    setTimeout(() => router.push("/Admin"), 3500); // Redirect after 3.5 seconds
  };

  const handleBackToLanding = () => {
    router.push("/"); // Redirect to landing page
  };

  return (
    <>
      <Head>
        <title>Login | Infinitech</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 relative">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-sm border border-blue-500 relative">
          <h2 className="text-3xl font-bold text-white text-center mb-6">Infini-Sign In</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-lg font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-lg font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {message && <p className="text-red-500 text-lg mt-2 text-center">{message}</p>}

            <div className="flex flex-col items-center space-y-3">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg text-lg transition"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <button
                type="button"
                className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg text-lg transition relative"
                onClick={handleAdminLogin}
              >
                Login as Admin
              </button>

              {/* 🔥 New Back to Landing Page Button */}
              <button
                type="button"
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg text-lg transition"
                onClick={handleBackToLanding}
              >
                ⬅ Back to Landing Page
              </button>
            </div>
          </form>

          <p className="text-lg text-center text-gray-400 mt-4">
            New here? <a href="/Signup" className="text-blue-400 hover:underline">Create an account</a>
          </p>

          {/* 🚨 Admin Warning Bubble Message */}
          {showAdminWarning && (
            <div className="absolute top-[-80px] right-0 transform transition-all duration-500 opacity-100 scale-100 bg-white text-gray-900 text-lg px-5 py-3 rounded-lg shadow-lg border border-gray-300 w-72">
              ⚠️ **Warning:** Once you log in as an **Admin**, there's no going back!
              {/* 🔻 Chat Bubble Arrow */}
              <div className="absolute bottom-[-12px] right-5 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white"></div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

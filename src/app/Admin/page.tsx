"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Directly check for admin credentials
    if (username === "admin" && password === "password") {
      sessionStorage.setItem("authToken", "fake-admin-token"); // Simulate token storage
      sessionStorage.setItem("userRole", "admin");
      router.push("/DashBoard"); // Redirect to dashboard
    } else {
      setMessage("Invalid credentials. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Admin Login | Infinitech</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-blue-500">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {message && <p className="text-red-500 text-sm mt-2 text-center">{message}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

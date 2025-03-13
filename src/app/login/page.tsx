"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic input validation
    if (!username || !password) {
      setMessage("Username and password are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        sessionStorage.setItem("authToken", response.data.token);
        response.data.usertype === "admin" ? router.push("/DashBoard") : router.push("/todolist");
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      // Handle specific error messages
      if (error.response?.status === 401) {
        setMessage("Invalid credentials. Please check your username and password.");
      } else {
        setMessage("Login failed. Please try again later.");
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Login | Infinitech</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
  
      {/* Background Image */}
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <Image
          src="/cram.png"
          alt="Task Management Background"
          layout="fill"
          objectFit="cover"
          className="absolute top-0 left-0 w-full h-full opacity-20"
        />
  
        {/* Login Box */}
        <div className="relative max-w-4xl p-8 mx-auto bg-gray-800 rounded-md shadow-md mt-20">
          <div className="flex items-center justify-center mb-6">
            <Image src="/" alt="Logo" width={100} height={100} className="mr-4" />
            <h2 className="text-3xl font-bold text-white">Infini-Sign In</h2>
          </div>
  
          <form onSubmit={handleLogin} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-white text-lg font-medium mb-2" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                placeholder="Enter your username"
                required
              />
            </div>
  
            <div>
              <label className="block text-white text-lg font-medium mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={22} /> : <EyeIcon size={22} />}
                </button>
              </div>
            </div>
  
            {message && <p className="text-red-500 text-lg mt-2 text-center col-span-2">{message}</p>}
  
            {/* Buttons */}
            <div className="flex flex-col items-center space-y-3 col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg text-lg transition font-semibold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
  
              <button
                type="button"
                className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-lg text-lg transition"
                onClick={() => router.push("/")}
              >
                ⬅ Back to Landing Page
              </button>
            </div>
          </form>
  
          <p className="text-lg text-center text-gray-400 mt-4 col-span-2">
            New here? <a href="/Signup" className="text-green-400 hover:underline">Create an account</a>
          </p>
        </div>
      </div>
    </>
  );
}
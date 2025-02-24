"use client";

import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false); // Track if the terms are checked

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  // Handle checkbox change
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTermsChecked(e.target.checked);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setIsSuccess(false);
      return;
    }

    if (!isTermsChecked) {
      setMessage("You must agree to the terms and conditions.");
      setIsSuccess(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("username", formData.username);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      if (profileImage) {
        formDataObj.append("profile_image", profileImage);
      }

      const res = await axios.post("http://localhost:8000/api/register", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
console.log(res);


      setMessage(res.data.message);
      setIsSuccess(true);
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      setProfileImage(null);
    } catch (error: any) {
      console.log(error)
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      setMessage(errorMessage);
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md border border-blue-500">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Register</h2>

        {message && (
          <p
            className={`text-center text-sm font-bold mb-4 p-2 rounded-lg ${
              isSuccess ? "text-green-500 bg-green-900/20 border border-green-500" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Profile Image Upload */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="w-full text-white bg-gray-800 rounded-lg border border-gray-600 px-2 py-1"
            />
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-400">
              <input
                type="checkbox"
                checked={isTermsChecked}
                onChange={handleTermsChange}
                className="mr-2"
                required
              />
              Agree to terms and conditions
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition"
          >
            Register
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

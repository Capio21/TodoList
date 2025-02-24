"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const handleThemeSwitch = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  const handleSignInClick = () => {
    setIsSignedIn(!isSignedIn);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-blue-900 text-white"
          : "bg-gradient-to-br from-blue-100 to-white text-gray-900"
      } relative`}
    >
      <header className="w-full p-6 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center">
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={40}
            height={40}
            className="mr-3"
          />
          <span className="text-2xl font-bold">InfiniTask</span>
        </div>
        <nav className="flex items-center">
          <a href="login" className="mx-3 text-lg hover:text-blue-500">
            My Tasks
          </a>
          <a href="login" className="mx-3 text-lg hover:text-blue-500">
            Projects
          </a>
          <button
            className="ml-6 px-5 py-3 rounded-full bg-gray-800 text-white text-lg"
            onClick={handleThemeSwitch}
          >
            {isDarkMode ? "Light" : "Dark"}
          </button>
          {isSignedIn ? (
            <button
              className="ml-6 px-5 py-3 rounded-full bg-red-600 text-white text-lg"
              onClick={handleSignInClick}
            >
              Sign Out
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="ml-6 px-5 py-3 rounded-full bg-blue-600 text-white text-lg"
              >
                Login
              </a>
              <a
                href="/Signup"
                className="ml-3 px-5 py-3 rounded-full bg-blue-400 text-white text-lg"
              >
                Sign Up
              </a>
            </>
          )}
        </nav>
      </header>

      <main className="flex flex-grow w-full max-w-7xl p-10">
        <div className="w-1/2 p-6">
          <h1 className="text-5xl font-extrabold mb-6">
            Organize Your Tasks, Achieve Your Goals
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            InfiniTask is your all-in-one task management solution, designed to
            streamline your workflow and boost productivity. Effortlessly create,
            update, and prioritize tasks, ensuring you stay focused on what matters
            most. Track your progress, set deadlines, and collaborate seamlessly
            with team members. Whether you're managing personal to-dos or complex
            project tasks, InfiniTask provides the tools you need to stay organized
            and accomplish your objectives.
          </p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-semibold">
            Get Started with InfiniTask &gt;
          </button>
        </div>

        <div className="w-1/2 p-6 grid grid-cols-2 gap-6">
          <div className="text-gray-400 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-3">About Us</h2>
            <p className="text-gray-400 text-md">
              InfiniTask is dedicated to helping individuals and teams manage their
              tasks more effectively. Our platform provides intuitive tools to
              organize, prioritize, and track progress, ensuring users can reach
              their goals efficiently.
            </p>
          </div>

          <div className="text-gray-400 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-3">Documents</h2>
            <ul className="list-disc list-inside text-md">
              <li className="mb-1">User Guide</li>
              <li className="mb-1">Project Documentation</li>
              <li>Task Management Best Practices</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
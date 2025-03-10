"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleThemeSwitch = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
  };

  const handleSignInClick = () => {
    setIsSignedIn(!isSignedIn);
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    let days = [];

    days.push(
      <div key="header" className="text-center text-xl font-bold mb-4">
        {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
      </div>
    );

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday =
        today.getDate() === day &&
        today.getMonth() === selectedDate.getMonth() &&
        today.getFullYear() === selectedDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center cursor-pointer rounded-lg text-xs transition-all ${
            isToday
              ? "bg-green-600 text-white font-bold"
              : selectedDate.getDate() === day
              ? "bg-green-800 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-green-700"
          }`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-gray-200 to-white text-gray-800"}`}
    >
      <Image
        src="/cram.png"
        alt="Task Management Background"
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 w-full h-full opacity-20"
      />

      <header className="w-full p-8 flex justify-between items-center border-b border-gray-600 relative z-10 text-xl">
        <div className="flex items-center">
          <Image src="/next.svg" alt="Next.js Logo" width={50} height={50} className="mr-4" />
          <span className="text-3xl font-bold text-green-600">InfiniTask</span>
        </div>

        <nav className="flex items-center">
          <div className="inline-flex rounded-md shadow-xs" role="group">
            {/* My Tasks Button */}
            <a href="/login" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-green-600 rounded-s-lg hover:bg-green-600 focus:z-10 focus:ring-2 focus:ring-green-500">
              My Tasks
            </a>

            {/* Login Button */}
            <a href="/login" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-green-600 hover:bg-green-600 focus:z-10 focus:ring-2 focus:ring-green-500">
              Login
            </a>

            {/* Sign Up Button */}
            <a href="/Signup" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-green-600 rounded-e-lg hover:bg-green-600 focus:z-10 focus:ring-2 focus:ring-green-500">
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      <main className="flex flex-col lg:flex-row w-full max-w-7xl p-12 relative z-10">
        <div className="w-full lg:w-1/2 p-8 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-600 mb-8">
            Cramming? Organize Your Tasks, Achieve Your Goals
          </h1>
          <p className="text-gray-300 text-xl sm:text-2xl mb-10">
            InfiniTask is your all-in-one task management solution, designed to streamline your workflow and boost productivity.
          </p>
        </div>

        <div className="w-full lg:w-1/2 p-8 flex flex-col items-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white text-center">
              <h2 className="text-lg sm:text-xl font-bold mb-3">Real-Time Calendar</h2>
              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-6">About Us</h2>
              <p className="text-lg text-gray-300">Learn more about our mission and how we help you stay productive.</p>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white text-center col-span-2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Documents</h2>
              <p className="text-lg text-gray-300">Access important files and resources related to your tasks.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

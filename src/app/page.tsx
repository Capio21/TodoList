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

  // Automatically update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedDate(new Date()); // Update date in real-time
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

    // Add Month and Year Display
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
                        ? "bg-red-600 text-white font-bold"
                        : selectedDate.getDate() === day
                        ? "bg-blue-600 text-white"
                        : "bg-blue-800 text-gray-300 hover:bg-blue-600"
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
      className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-blue-900 text-white"
          : "bg-gradient-to-br from-blue-100 to-white text-gray-900"
      }`}
    >
      <Image
        src="/cram.png"
        alt="Task Management Background"
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 w-full h-full opacity-20"
      />

      <header className="w-full p-8 flex justify-between items-center border-b border-gray-700 relative z-10 text-xl">
        <div className="flex items-center">
          <Image src="/next.svg" alt="Next.js Logo" width={50} height={50} className="mr-4" />
          <span className="text-3xl font-bold">InfiniTask</span>
        </div>
        
        <nav className="flex items-center">
         

          



          {/* <button
            className="ml-6 px-6 py-4 rounded-full bg-gray-800 text-white text-lg"
            onClick={handleThemeSwitch}
          >
            {isDarkMode ? "Light" : "Dark"}
          </button> */}
          <div className="inline-flex rounded-md shadow-xs" role="group">
  {/* My Tasks Button */}
  <a href="/login" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
    <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
    </svg>
    My Tasks
  </a>

  {/* Login Button */}
  <a href="/login" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
    <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
    </svg>
    Login
  </a>

  {/* Sign Up Button */}
  <a href="/Signup" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
    <svg className="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z"/>
      <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/>
    </svg>
    Sign Up
  </a>
</div>

        </nav>
      </header>

      <main className="flex flex-grow w-full max-w-7xl p-12 relative z-10">
      <div className="w-1/2 p-8 flex flex-col items-center text-center">
  <h1 className="text-6xl font-extrabold mb-8">
    Cramming? Organize Your Tasks, Achieve Your Goals
  </h1>
  <p className="text-gray-300 text-2xl mb-10">
    InfiniTask is your all-in-one task management solution, designed to streamline your workflow and boost productivity.
  </p>
</div>

        <div className="w-1/2 p-8 flex flex-col items-end">
          <div className="grid grid-cols-2 gap-6 w-full">
            <div className="to-blue-900 p-4 rounded-lg shadow-lg text-white text-center">
              <h2 className="text-lg font-bold mb-3">Real-Time Calendar</h2>
              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            </div>

            <div className="to-blue-900 p-8 rounded-lg shadow-lg text-white text-center">
              <h2 className="text-3xl font-bold mb-6">About Us</h2>
              <p className="text-lg text-gray-300">Learn more about our mission and how we help you stay productive.</p>
            </div>

            <div className="to-blue-900 p-8 rounded-lg shadow-lg text-white text-center col-span-2">
              <h2 className="text-3xl font-bold mb-6">Documents</h2>
              <p className="text-lg text-gray-300">Access important files and resources related to your tasks.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

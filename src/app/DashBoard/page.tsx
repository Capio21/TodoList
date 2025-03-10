"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Adminbar from "../Components/adminsidebar";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const CustomCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(newDate);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg w-full flex flex-col items-center">
      <h2 className="text-lg font-semibold text-center mb-2 text-green-300">{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</h2>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={index} className="text-transparent">.</div> // Empty cells for alignment
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          return (
            <div
              key={day}
              onClick={() => handleDateClick(day)}
              className={`flex items-center justify-center cursor-pointer w-12 h-12 rounded-lg transition duration-200 
                ${selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth() ? 'bg-green-500 text-white' : 'bg-gray-700 text-green-200 hover:bg-gray-600'}`}
            >
              <span className="text-2xl font-bold">{day}</span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-gray-400 mt-2">
        Selected: <span className="font-bold">{selectedDate.toDateString()}</span>
      </p>
    </div>
  );
};

export default function Dashboard() {
  const [taskCount, setTaskCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [taskData, setTaskData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await axios.get(`${API_BASE_URL}/tasks`);
        const tasks = tasksRes.data;

        setTaskCount(tasks.length);
        setPendingCount(tasks.filter((task) => task.status === "pending").length);
        setCompletedCount(tasks.filter((task) => task.status === "complete").length);
        setArchivedCount(tasks.filter((task) => task.archive === true).length);

        const groupedTasks = tasks.reduce((acc, task) => {
          const date = new Date(task.date).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const formattedData = Object.keys(groupedTasks).map((date) => ({
          date,
          tasks: groupedTasks[date],
        }));

        setTaskData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Data for the donut chart
  const data = [
    { name: 'Pending', value: pendingCount },
    { name: 'Completed', value: completedCount },
  ];

  const COLORS = ['#FFBB28', '#00C49F'];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Adminbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-5 w-full">
        <h1 className="text-3xl font-bold mb-4 text-green-300">Admin Dashboard</h1>

        {/* Date & Time */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-green-200">{currentTime.toLocaleDateString()}</p>
          <p className="text-2xl font-bold text-green-400">{currentTime.toLocaleTimeString()}</p>
        </div>

        {/* Task Stats - Single Row */}
        <div className="w-full flex justify-center gap-6 mb-5 flex-wrap">
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg text-center w-48">
            <h2 className="text-xl font-semibold text-gray-200">Total Tasks</h2>
            <p className="text-4xl font-bold text-gray-300">{taskCount}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-xl shadow-lg text-center w-48">
            <h2 className="text-xl font-semibold text-gray-200">Pending</h2>
            <p className="text-4xl font-bold text-yellow-400">{pendingCount}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-xl shadow-lg text-center w-48">
            <h2 className="text-xl font-semibold text-gray-200">Completed</h2>
            <p className="text-4xl font-bold text-gray-500">{completedCount}</p>
          </div>
        </div>

        {/* Chart & Custom Calendar */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold text-center mb-2 text-green-300">Task Progress</h2>
            <ResponsiveContainer width={350} height={350}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80} // Adjusted for a cleaner donut look
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Calendar */}
          <CustomCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>
      </main>
    </div>
  );
}
"use client";

import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function TaskDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Button to Open Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" onClick={() => setOpen(true)}>
            <FaBell className="text-xl" />
            <span className="ml-2">My Tasks</span>
          </Button>
        </DrawerTrigger>

        {/* Drawer Content */}
        <DrawerContent className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">My Tasks</h2>
            <DrawerClose asChild>
              <Button variant="ghost">Close</Button>
            </DrawerClose>
          </div>

          {/* Task List (Replace with dynamic data) */}
          <ul className="mt-4 space-y-2">
            <li className="p-3 bg-gray-100 rounded-md">📌 Task 1 - Pending</li>
            <li className="p-3 bg-gray-100 rounded-md">✅ Task 2 - Completed</li>
            <li className="p-3 bg-gray-100 rounded-md">🚨 Task 3 - Overdue</li>
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
}

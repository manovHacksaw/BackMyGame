"use client";
import { useTheme } from "@/context/ThemeContext"; // Import the useTheme hook
import { Switch } from "./ui/switch";
import { FiSun, FiMoon } from "react-icons/fi";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme(); // Destructure darkMode and toggleDarkMode from context

  return (
    <div className="fixed bottom-4 right-4 opacity-60 hover:opacity-100 transition-opacity z-50">
      <label className="flex items-center space-x-2 bg-gray-300 dark:bg-gray-800 p-2 rounded-lg shadow-lg">
        {darkMode ? (
          <FiMoon className="text-gray-300" size={18} />
        ) : (
          <FiSun className="text-yellow-900" size={18} />
        )}
        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} /> {/* Call toggleDarkMode */}
      </label>
    </div>
  );
}

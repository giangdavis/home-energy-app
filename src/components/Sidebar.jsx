import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Plus,
  History,
  Upload,
  AlertCircle,
  LineChart,
  Calculator,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/summary", icon: Home, color: "text-gray-500" },
  { name: "New Entry", path: "/new-entry", icon: Plus, color: "text-green-500" },
  { name: "History", path: "/history", icon: History, color: "text-blue-500" },
  { name: "Bulk Upload", path: "/upload", icon: Upload, color: "text-orange-500" },
  { name: "Alerts", path: "/alerts", icon: AlertCircle, color: "text-yellow-500" },
  { name: "Trends", path: "/trends", icon: LineChart, color: "text-pink-500" },
  { name: "Cost Calculator", path: "/calculator", icon: Calculator, color: "text-cyan-500" },
];

const Sidebar = ({ onSignOut }) => {
  return (
    <div className="flex h-full w-64 flex-col bg-app-gray">
      {/* Sidebar Header */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-semibold">Energy Dashboard</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md group text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <item.icon
              className={`h-6 w-6 flex-shrink-0 mr-3 ${item.color} group-hover:text-white`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Sign Out Button */}
      <button
        onClick={onSignOut}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-red-500"
      >
        <LogOut className="h-6 w-6 flex-shrink-0 mr-3 text-red-500 group-hover:text-white" />
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;

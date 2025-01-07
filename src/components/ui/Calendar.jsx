import React, { useState } from "react";
import {
  format,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval
} from "date-fns";

export function Calendar({ mode = "single", selected, onSelect }) {
  // Track which month the calendar is currently showing
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Figure out the “start” (Sunday of first week in that month)
  // and “end” (Saturday of last week in that month)
  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfWeek(endOfMonth(currentMonth));

  // Create an array of all days from 'start' to 'end'
  const dates = eachDayOfInterval({ start, end });

  // Days of the week labels
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function handlePrevMonth() {
    setCurrentMonth(addMonths(currentMonth, -1));
  }

  function handleNextMonth() {
    setCurrentMonth(addMonths(currentMonth, 1));
  }

  return (
    <div>
      {/* Month / Year Header + Navigation */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={handlePrevMonth} className="px-2 py-1 bg-gray-200 rounded">
          Prev
        </button>
        <span className="font-semibold">{format(currentMonth, "MMMM yyyy")}</span>
        <button onClick={handleNextMonth} className="px-2 py-1 bg-gray-200 rounded">
          Next
        </button>
      </div>

      {/* Grid with day-of-week labels */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <div key={day} className="text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}

        {/* Map each date cell */}
        {dates.map((date) => {
          // Check if this date matches the 'selected' prop
          const isSelected =
            selected && format(date, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");

          return (
            <button
              key={date.toString()}
              onClick={() => onSelect(date)}
              className={`p-2 rounded-lg ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-app-dark text-gray-400 hover:bg-gray-700"
              }`}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

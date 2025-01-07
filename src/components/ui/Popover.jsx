import React, { useState, useRef, useEffect } from "react";

export function Popover({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{children[0]}</div>
      {isOpen && (
        <div className="absolute bg-app-dark border border-gray-700 rounded-lg p-2 shadow-lg mt-2">
          {children[1]}
        </div>
      )}
    </div>
  );
}

export function PopoverTrigger({ children }) {
  return <>{children}</>;
}

export function PopoverContent({ children, className }) {
  return <div className={`p-2 ${className || ""}`}>{children}</div>;
}

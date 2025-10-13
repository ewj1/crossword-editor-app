import { useState, useRef, useEffect } from "react";
import { DropdownItem } from "./DropdownItem";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* User Icon */}
      <button
        onClick={toggleDropdown}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 focus:outline-none"
      >
        U
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
          <DropdownItem>My Puzzles</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <button
            className="mt-1 block w-full border-t border-gray-200 px-4 py-2 text-left hover:bg-gray-100"
            onClick={() => alert("Logout clicked")}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

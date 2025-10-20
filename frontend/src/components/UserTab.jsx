import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/useAuth";
import { UserDropdown } from "./UserDropdown";
import { GoogleLoginButton } from "./GoogleLoginButton";

export function UserTab() {
  const { user, loading, login, logout } = useAuth();
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

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />;
  }

  return user ? (
    <div className="relative inline-block" ref={dropdownRef}>
      <button onClick={toggleDropdown}>
        <img
          src={user.google_avatar}
          alt={user.name}
          className="h-10 w-10 rounded-full"
          referrerPolicy="no-referrer"
        />
      </button>
      <UserDropdown isOpen={isOpen} logout={logout} />
    </div>
  ) : (
    <GoogleLoginButton handleLogin={() => login()} />
  );
}

import { useNavigate } from "react-router-dom";
import { DropdownItem } from "./DropdownItem";

export function UserDropdown({ isOpen, logout }) {
  const navigate = useNavigate();
  return (
    <>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
          <DropdownItem onClick={() => navigate("/my-puzzles")}>
            My Puzzles
          </DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <button
            className="mt-1 block w-full border-t border-gray-200 px-4 py-2 text-left hover:bg-gray-100"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

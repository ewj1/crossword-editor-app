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
          <DropdownItem onClick={logout}>Logout</DropdownItem>
        </div>
      )}
    </>
  );
}

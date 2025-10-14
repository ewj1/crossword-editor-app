export function DropdownItem({ onClick, style, children }) {
  return (
    <button
      className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${style}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

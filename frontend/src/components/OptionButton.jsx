export function OptionButton({ children, onClick }) {
  return (
    <button
      className="w-full rounded bg-gray-200 px-4 py-2 text-gray-800 transition hover:bg-gray-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

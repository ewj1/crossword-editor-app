export function SaveButton({ onSave, saving }) {
  return (
    <>
      <button
        onClick={onSave}
        disabled={saving}
        className="flex flex-col items-start text-sm text-gray-800 hover:font-bold"
      >
        <span className="text-lg">💾</span>
        <span className="mt-1">Save</span>
      </button>
    </>
  );
}

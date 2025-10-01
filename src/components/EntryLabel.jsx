import { EditableSpan } from "../components/EditableSpan";

export function EntryLabel({ selectedIndex, isHorizontal, clue, updateClue }) {
  return (
    <div className="min-h-10 w-xs border-t border-b border-blue-100">
      <span className="min-h-[1.5rem] text-sm font-bold">
        {selectedIndex
          ? `${selectedIndex} ${isHorizontal ? "ACROSS" : "DOWN"}`
          : "NONE SELECTED"}
      </span>
      {selectedIndex && (
        <EditableSpan
          value={clue}
          setValue={updateClue}
          styleVariant="min-h-[1.5rem] text-md ml-2"
        />
      )}
    </div>
  );
}

import { EditableSpan } from "../components/EditableSpan";

export function EntryLabel({ selectedIndex, isHorizontal, clue, updateClue }) {
  return (
    <div className="flex gap-2 pl-4">
      <h1 className="min-h-[1.5rem] text-sm font-bold">
        {selectedIndex
          ? `${selectedIndex} ${isHorizontal ? "ACROSS" : "DOWN"}`
          : "NONE SELECTED"}
      </h1>
      <EditableSpan
        value={clue}
        setValue={updateClue}
        styleVariant="min-h-[1.5rem] text-sm"
      />
    </div>
  );
}

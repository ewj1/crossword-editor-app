import { useState } from "react";
import { SaveButton } from "./SaveButton";
import { ExportButton } from "./ExportButton";
import { Popup } from "./Popup";
import { OptionButton } from "./OptionButton";

export function Toolbar({ onSave, onExport, saving }) {
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  return (
    <>
      <div className="mt-12 flex w-12 flex-col items-start space-y-2">
        <SaveButton onSave={onSave} saving={saving} />
        <ExportButton onExport={() => setPopupIsOpen(true)} />
        <Popup open={popupIsOpen}>
          <div className="flex flex-col items-center gap-0.5">
            <p className="m-2">Which would you like to export?</p>
            <OptionButton onClick={() => onExport(false)}>Puzzle</OptionButton>
            <OptionButton onClick={() => onExport(true)}>
              Answer Key
            </OptionButton>
            <OptionButton
              className="w-full rounded bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200"
              onClick={() => setPopupIsOpen(false)}
            >
              Cancel
            </OptionButton>
          </div>
        </Popup>
      </div>
    </>
  );
}

import { SaveButton } from "./SaveButton";
import { ExportButton } from "./ExportButton";

export function Toolbar({ onSave, onExport }) {
  return (
    <>
      <div className="flex flex-col">
        <SaveButton onSave={onSave} />
        <ExportButton onExport={onExport} />
      </div>
    </>
  );
}

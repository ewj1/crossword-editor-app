import { SaveButton } from "./SaveButton";
import { ExportButton } from "./ExportButton";

export function Toolbar({ onSave, onExport }) {
  return (
    <>
      <div className="mt-12 flex w-12 flex-col items-start space-y-2">
        <SaveButton onSave={onSave} />
        <ExportButton onExport={onExport} />
      </div>
    </>
  );
}

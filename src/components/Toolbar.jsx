import { SaveButton } from "./SaveButton";
import { ExportButton } from "./ExportButton";

export function Toolbar() {
  return (
    <>
      <div className="flex flex-col">
        <SaveButton />
        <ExportButton />
      </div>
    </>
  );
}

import { EditableSpan } from "./EditableSpan";

export function Title({ title, setTitle, name, setName }) {
  return (
    <div>
      <EditableSpan value={title} setValue={setTitle}></EditableSpan>
      <span className="mx-2">by</span>
      <EditableSpan value={name} setValue={setName}></EditableSpan>
    </div>
  );
}

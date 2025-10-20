import { EditableSpan } from "./EditableSpan";

export function Title({ title, setTitle, author, setAuthor }) {
  return (
    <>
      <div className="m-2 flex text-2xl text-gray-400">
        <EditableSpan
          value={title}
          setValue={setTitle}
          styleVariant="text-black"
        ></EditableSpan>
        <span className="mx-[0.5rem]">by</span>
        <EditableSpan value={author} setValue={setAuthor}></EditableSpan>
      </div>
    </>
  );
}

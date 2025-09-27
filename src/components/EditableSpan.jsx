export function EditableSpan({ value, setValue }) {
  return (
    <label className="relative inline-block border-b-2 border-white focus-within:border-blue-500">
      <span className="whitespace-pre">{value}</span>
      <input
        className="absolute top-0 left-0 w-full bg-white align-top outline-none"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      ></input>
    </label>
  );
}

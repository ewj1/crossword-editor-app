import { useRef } from "react";
import { useEditable } from "use-editable";

export function EditableSpan({ value, setValue, styleVariant = "" }) {
  const spanRef = useRef(null);
  useEditable(spanRef, setValue);
  return (
    <span
      className={`min-w-1 decoration-blue-500 underline-offset-6 outline-none hover:bg-blue-200 focus:underline ${styleVariant}`}
      ref={spanRef}
    >
      {value}
    </span>
  );
}
//     <label className="relative inline-block border-b-2 border-white focus-within:border-blue-500"></label>
// <input
//         className="absolute top-0 left-0 bg-white align-top outline-none"
//         style={{ width: "100%" }}
//         value={value}
//         onChange={(e) => {
//           setValue(e.target.value);
//         }}
//       ></input>

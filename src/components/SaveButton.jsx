export function SaveButton({onSave}) {
  await fetch("/puzzles/save", {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // since you're sending JSON
    "Accept": "application/json"        // nice-to-have, ensures JSON back
  },
  body: JSON.stringify({
    title: "My Puzzle",
    pieces: [1, 2, 3],
    difficulty: "hard"
  }),
  credentials: "include", // <-- super important! sends cookies
});
  return (
    <>
      <button onClick={onSave}>Save</button>
    </>
  );
}

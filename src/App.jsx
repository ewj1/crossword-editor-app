import { Routes, Route } from "react-router-dom";
import { EditorPage } from "./pages/EditorPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<EditorPage />} />
      <Route path="/puzzles/:puzzleId" element={<EditorPage />} />
    </Routes>
  );
}

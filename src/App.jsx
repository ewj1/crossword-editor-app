import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditorPage } from "./pages/EditorPage";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/puzzles/:puzzleId" element={<EditorPage />} />
      </Routes>
      <ToastContainer position="top-center" hideProgressBar={true} />
    </>
  );
}

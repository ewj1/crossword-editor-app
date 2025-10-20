import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/Layout";
import { EditorPage } from "./pages/EditorPage";
import { MyPuzzlesPage } from "./pages/MyPuzzlesPage";

export function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<EditorPage />} />
          <Route path="/puzzles/:puzzleId" element={<EditorPage />} />
          <Route path="/my-puzzles" element={<MyPuzzlesPage />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          classNames: {
            toast: "rounded-2xl shadow-lg font-medium",
            title: "text-base",
            description: "text-sm text-gray-400",
          },
        }}
      />
    </>
  );
}

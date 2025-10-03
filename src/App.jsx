import { useState, useEffect, useRef } from "react";

import { useAuth } from "./auth/useAuth";
import { useImmerReducer } from "use-immer";

import { apiFetch } from "./api/apiFetch";

import { gridReducer } from "./reducers/gridReducer";
import { createGrid, createClues } from "./utils/gridUtils";

import { Grid } from "./components/Grid";
import { UserTab } from "./components/UserTab";
import { Title } from "./components/Title";
import { Toolbar } from "./components/Toolbar";

const API_URL = import.meta.env.VITE_API_URL;

export function App() {
  const [title, setTitle] = useState("Untitled");
  const [author, setAuthor] = useState("Anonymous");
  const size = 15;
  const gridRef = useRef(null);
  const { user } = useAuth();
  const savedGrid = sessionStorage.getItem("grid");
  const initialState = savedGrid
    ? { ...JSON.parse(savedGrid) }
    : {
        grid: createGrid(size),
        gridActive: false,
        selectedCell: null,
        isHorizontal: true,
        clues: createClues(size),
      };

  const [gridState, dispatch] = useImmerReducer(gridReducer, initialState);

  useEffect(() => {
    setAuthor(user?.name || "Anonymous");
  }, [user]);

  async function handleSave() {
    await apiFetch("/puzzles/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gridState),
      credentials: "include",
    });
  }

  async function handleExport() {
    await apiFetch("/puzzles/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gridRef.current.getSaveData()),
      credentials: "include",
    });
  }
  return (
    <>
      <div className="m-4 flex justify-start gap-4">
        <Toolbar onSave={handleSave} onExport={handleExport} />
        <div>
          <Title
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
          ></Title>
          <Grid state={gridState} dispatch={dispatch}></Grid>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-2 select-none">
        <UserTab gridState={gridState} />
      </div>
    </>
  );
}

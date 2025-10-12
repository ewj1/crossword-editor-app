import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { useAuth } from "../auth/useAuth";

import { apiFetch } from "../api/apiFetch";
import { gridReducer } from "../reducers/gridReducer";
import { createGrid, createClues } from "../utils/gridUtils";

import { Grid } from "../components/Grid";
import { UserTab } from "../components/UserTab";
import { Title } from "../components/Title";
import { Toolbar } from "../components/Toolbar";

const API_URL = import.meta.env.VITE_API_URL;

export function EditorPage() {
  const [title, setTitle] = useState("Untitled");
  const [author, setAuthor] = useState("Anonymous");
  const [loading, setLoading] = useState(true);
  const size = 15;
  const gridRef = useRef(null);
  const { user } = useAuth();
  const { puzzleId } = useParams();
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
    console.log("puzzleId", puzzleId);
    async function load() {
      if (puzzleId) {
        const { data } = await apiFetch(`/puzzles/${puzzleId}`);
        dispatch({ type: "setGrid", value: data.grid });
      } else {
        dispatch({ type: "setGrid", value: createGrid(size) });
      }
      setLoading(false);
    }
    load();
  }, [puzzleId, dispatch]);

  useEffect(() => {
    setAuthor(user?.name || "Anonymous");
  }, [user]);

  async function handleSave() {
    try {
      const isUpdate = puzzleId != null;
      const { data } = await apiFetch(
        isUpdate ? `/puzzles/${puzzleId}` : "/puzzles/",
        {
          method: isUpdate ? "PUT" : "POST",
          body: JSON.stringify({
            grid: gridState.grid,
            title: gridState.title,
            clues: gridState.clues,
          }),
        },
      );
      if (!isUpdate) {
        const newUrl = `/puzzles/${data}`;
        window.history.pushState({}, "", newUrl);
      }
    } catch (err) {
      if (err.status === 401) {
        alert("Please log in before saving.");
      } else if (err.status >= 500) {
        alert("Server error. Please try again.");
      } else {
        alert(err.message);
      }
    }
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
  if (loading) return <p>loading</p>;
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

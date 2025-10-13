import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { useAuth } from "../auth/useAuth";

import { toast } from "react-toastify";
import { apiFetch } from "../api/apiFetch";
import { gridReducer } from "../reducers/gridReducer";
import { createGrid, createClues } from "../utils/gridUtils";

import { Grid } from "../components/Grid";
import { UserTab } from "../components/UserTab";
import { Title } from "../components/Title";
import { Toolbar } from "../components/Toolbar";
import { DropdownItem } from "../components/DropdownItem";
import { UserDropdown } from "../components/UserDropdown";

const API_URL = import.meta.env.VITE_API_URL;

export function EditorPage() {
  const [title, setTitle] = useState("Untitled");
  const [author, setAuthor] = useState("Anonymous");
  const [loading, setLoading] = useState(true);
  const size = 15;
  const gridRef = useRef(null);
  const { user } = useAuth();
  const { puzzleId } = useParams();
  const navigate = useNavigate();

  const initialState = {
    grid: createGrid(size),
    gridActive: false,
    selectedCell: null,
    isHorizontal: true,
    clues: createClues(size),
  };

  const [gridState, dispatch] = useImmerReducer(gridReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function load() {
      if (!puzzleId) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await apiFetch(`/puzzles/${puzzleId}`, { signal });
        console.log(data, "EDITORPAGE.JSX DATA");
        dispatch({ type: "loadGrid", value: data });
        setTitle(data.title);
        setLoading(false);
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          alert(err);
          navigate("/");
        }
      }
    }
    load();
    return () => {
      controller.abort();
    };
  }, [puzzleId, dispatch, navigate]);

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
            title: title,
            clues: gridState.clues,
          }),
        },
      );
      if (!isUpdate) {
        const newUrl = `/puzzles/${data}`;
        navigate(newUrl);
      }
    } catch (err) {
      if (err.status === 401) {
        toast.warn("Please log in before saving.");
      } else if (err.status >= 500) {
        toast.error("Server error. Please try again.");
      } else {
        toast.error(err.message);
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
      <div className="m-4 flex items-start gap-4">
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
        <UserTab />
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { useAuth } from "@/auth/useAuth";

import { toast } from "sonner";
import { apiFetch } from "@/api/apiFetch";
import { gridReducer } from "@/reducers/gridReducer";
import { createGrid, createClues } from "@/utils/gridUtils";
import { generatePDF } from "@/utils/generatePDF";

import { Grid } from "@/components/Grid";
import { UserTab } from "@/components/UserTab";
import { Title } from "@/components/Title";
import { Toolbar } from "@/components/Toolbar";
import { LoadingScreen } from "@/components/LoadingScreen";

const API_URL = import.meta.env.VITE_API_URL;

export function EditorPage() {
  const [title, setTitle] = useState("Untitled");
  const [author, setAuthor] = useState("Anonymous");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const size = 15;
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
        dispatch({ type: "loadGrid", value: data });
        setTitle(data.title);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
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
    const toastId = toast.loading("Saving your crossword... 🧩");
    setSaving(true);
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
      toast.success("Crossword saved successfully! 💾", {
        id: toastId,
        description: "You can now view or share it from your dashboard.",
        action: {
          label: "View",
          onClick: () => navigate`/puzzles/${data}`,
        },
      });
      if (!isUpdate) {
        navigate(`/puzzles/${data}`);
      }
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        toast.error("Failed to save crossword.", {
          id: toastId,
          description: "Please log in before saving.",
        });
      } else if (err.status >= 500) {
        toast.error("Failed to save crossword.", {
          id: toastId,
          description: "Please try again in a moment.",
        });
      } else {
        toast.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleExport(answerKey) {
    generatePDF(gridState.grid, gridState.clues, title, answerKey);
  }

  if (loading) return <LoadingScreen />;
  return (
    <>
      <div className="m-4 flex items-start gap-4">
        <Toolbar onSave={handleSave} onExport={handleExport} saving={saving} />
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

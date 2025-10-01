import { useState, useEffect, useRef } from "react";

import { useAuth } from "./context/useAuth";

import { Grid } from "./components/Grid";
import { UserTab } from "./components/UserTab";
import { Title } from "./components/Title";
import { Toolbar } from "./components/Toolbar";

export function App() {
  const [title, setTitle] = useState("Untitled");
  const [author, setAuthor] = useState("Anonymous");
  const puzzleDataRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    setAuthor(user?.name || "Anonymous");
  }, [user]);

  async function handleSave() {
    await fetch("/puzzles/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(puzzleDataRef.current),
      credentials: "include",
    });
  }
  return (
    <>
      <div className="m-4 flex justify-start gap-4">
        <Toolbar onSave={handleSave} />
        <div>
          <Title
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
          ></Title>
          <Grid
            size={15}
            onDataChange={(data) => {
              puzzleDataRef.current = data;
            }}
          ></Grid>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-2 select-none">
        <UserTab />
      </div>
    </>
  );
}

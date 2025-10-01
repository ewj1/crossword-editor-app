import { useState, useEffect } from "react";

import { Grid } from "./components/Grid";
import { UserTab } from "./components/UserTab";
import { Title } from "./components/Title";
import { useAuth } from "./context/useAuth";

export function App() {
  const [title, setTitle] = useState("Untitled");
  const [author, setAuthor] = useState("Anonymous");
  const { user } = useAuth();

  useEffect(() => {
    setAuthor(user?.name || "Anonymous");
  }, [user]);

  return (
    <>
      <div className="m-4 flex justify-start gap-4">
        <div>
          <Title
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
          ></Title>
          <Grid size={15}></Grid>
        </div>
      </div>
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-2 select-none">
        <UserTab />
      </div>
    </>
  );
}

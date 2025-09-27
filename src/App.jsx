import { useState } from "react";

import { Grid } from "./components/Grid";
import { AuthStatus } from "./components/AuthStatus";
import { LoginButton } from "./components/LoginButton";
import { LogoutButton } from "./components/LogoutButton";
import { Title } from "./components/Title";

export default function App() {
  const [title, setTitle] = useState("Untitled");
  const [name, setName] = useState("Anonymous");
  const [user, setUser] = useState(null);

  function handleLogout() {
    setUser(null);
  }
  return (
    <>
      <div className="flex justify-center gap-4">
        <div className="flex flex-col">
          <AuthStatus user={user} setUser={setUser} />
          <LoginButton />
          <LogoutButton onLogout={handleLogout} />
        </div>
        <div className="flex flex-col">
          <Title
            title={title}
            setTitle={setTitle}
            name={name}
            setName={setName}
          ></Title>
          <Grid size={15}></Grid>
        </div>
      </div>
    </>
  );
}

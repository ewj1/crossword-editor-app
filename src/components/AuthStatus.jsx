import { useEffect } from "react";

export function AuthStatus({ user, setUser }) {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user.name);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      }
    };

    fetchUser();
  }, [user, setUser]);

  if (!user) return <div>Not logged in</div>;
  return <span>Logged in as {user}</span>;
}

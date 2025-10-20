import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetchUser } from "@/api/apiFetchUser";
import { apiLogout } from "@/api/apiLogout";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { user, error } = await apiFetchUser();
      setUser(error ? null : user);
      setLoading(false);
    })();
  }, []);

  function login() {
    window.location.href = "http://localhost:3000/auth/google";
  }

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

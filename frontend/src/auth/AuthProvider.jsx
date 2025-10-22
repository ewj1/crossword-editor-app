import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { apiFetchUser } from "@/api/apiFetchUser";
import { apiLogout } from "@/api/apiLogout";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { user, error } = await apiFetchUser();
      setUser(error ? null : user);
      setLoading(false);
    })();
  }, []);

  function login() {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  }

  async function logout() {
    await apiLogout();
    setUser(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

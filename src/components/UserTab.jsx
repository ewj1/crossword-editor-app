import { useAuth } from "../context/useAuth";
import { GoogleLoginButton } from "./GoogleLoginButton";

export function UserTab() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />;
  }

  return user ? (
    <div className="flex items-center gap-3">
      <img
        src={user.google_avatar}
        alt={user.name}
        className="h-8 w-8 rounded-full"
        referrerPolicy="no-referrer"
      />
      <span>{user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <GoogleLoginButton handleLogin={login} />
  );
}

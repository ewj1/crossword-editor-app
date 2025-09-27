export function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    onLogout();
  };

  return (
    <button className="border-1" onClick={handleLogout}>
      Logout
    </button>
  );
}

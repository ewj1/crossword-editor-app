import { Outlet, Link } from "react-router-dom";

export function Layout() {
  return (
    <>
      <header className="flex items-center gap-2 border-b p-5">
        <Link to="/" className="flex items-center gap-2" aria-label="Home">
          <img
            src="/crossword-logo.svg"
            alt="Crossword Logo"
            width={32}
            height={32}
          />
          <span className="font-semibold">Crossword Editor</span>
        </Link>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}

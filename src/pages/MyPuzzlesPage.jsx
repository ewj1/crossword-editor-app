import { useAuth } from "@/auth/useAuth";
import { UserPuzzlesList } from "@/components/UserPuzzlesList";
import { GoogleLoginButton } from "../components/GoogleLoginButton";

export function MyPuzzlesPage() {
  const { user, login } = useAuth();
  console.log("my puzzles page!!");
  if (!user) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="text-3xl font-semibold">
          🧩 Sign in to view your puzzles
        </div>
        <p className="max-w-md text-gray-500">
          You can create, edit, and save your own crossword puzzles once you're
          signed in.
        </p>
        <GoogleLoginButton handleLogin={login} />
      </div>
    );
  }

  return <UserPuzzlesList userId={user.id} />;
}

import { useState, useEffect } from "react";
import { apiFetch } from "@/api/apiFetch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "@/components/LoadingScreen";

export function UserPuzzlesList() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const { data } = await apiFetch("/puzzles/");
        console.log(data, "my puzzle fetch data!!");
        setPuzzles(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPuzzles();
  }, []);

  if (loading) return <LoadingScreen>Loading your puzzles...</LoadingScreen>;
  if (!puzzles.length) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center text-gray-500">
        <div className="mb-2 text-5xl">🧩</div>
        <p>You haven't created any puzzles yet.</p>
      </div>
    );
  }
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-semibold">My Puzzles</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <div
            key={puzzle.id}
            onClick={() => navigate(`/puzzles/${puzzle.id}`)}
            className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <h2 className="mb-1 text-lg font-medium">{puzzle.title}</h2>
            <p className="line-clamp-2 text-sm text-gray-600">
              {puzzle.description || "No description provided."}
            </p>
            <div className="mt-3 text-xs text-gray-400">
              Created: {new Date(puzzle.created_at).toLocaleString()}
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Last Updated: {new Date(puzzle.last_modified).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

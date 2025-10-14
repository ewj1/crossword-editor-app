import { useState, useEffect } from "react";
import { apiFetch } from "@/api/apiFetch";
import { toast } from "sonner";
import { PuzzleCard } from "@/components/PuzzleCard";
import { LoadingScreen } from "@/components/LoadingScreen";

export function UserPuzzlesList() {
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const { data } = await apiFetch("/puzzles/");
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
          <PuzzleCard key={puzzle.id} puzzle={puzzle} />
        ))}
        <PuzzleCard isAddCard={true} />
      </div>
    </div>
  );
}

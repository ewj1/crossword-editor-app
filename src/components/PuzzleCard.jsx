import { useNavigate } from "react-router-dom";
export function PuzzleCard({ puzzle, isAddCard }) {
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          navigate(isAddCard ? "/" : `/puzzles/${puzzle.id}`);
        }}
        className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
      >
        {isAddCard ? (
          <>
            <div className="mb-2 text-4xl text-gray-400">+</div>
            <div className="text-lg font-medium text-gray-700">
              Create new puzzle
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
}

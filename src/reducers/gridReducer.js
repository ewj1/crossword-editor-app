import { calcNextCell, findOrderedHighlightedCells } from "../utils/gridUtils";

export function gridReducer(draft, action) {
  if (!draft.selectedCell && action.type !== "selectedCell") {
    return;
  }
  const size = draft.grid.length;
  const row = draft.selectedCell?.row;
  const col = draft.selectedCell?.col;
  switch (action.type) {
    case "deleted":
      if (draft.grid[row][col] === ".") {
        draft.grid[size - 1 - row][size - 1 - col] = "";
      }
      draft.grid[row][col] = "";

      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        size,
        draft.isHorizontal,
        "backward",
      );
      break;

    case "insertedLetter":
      draft.grid[row][col] = action.value;
      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        size,
        draft.isHorizontal,
        "forward",
      );
      break;

    case "selectedCell":
      draft.gridActive = true;
      draft.selectedCell = { row: action.row, col: action.col };
      break;

    case "deactivateGrid":
      draft.gridActive = false;
      break;

    case "toggledDirection":
      draft.isHorizontal = action.value;
      break;

    case "moved":
      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        size,
        draft.isHorizontal,
        action.direction === "right" || action.direction === "down"
          ? "forward"
          : "backward",
      );
      break;

    case "insertedBox":
      draft.grid[row][col] = ".";
      draft.grid[size - 1 - row][size - 1 - col] = ".";
      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        size,
        draft.isHorizontal,
        "forward",
      );
      break;

    case "selectedSuggestion": {
      const highlightedCells = findOrderedHighlightedCells(
        draft.grid,
        draft.selectedCell,
        draft.isHorizontal,
      );
      highlightedCells
        .map((cell) => cell.split("-"))
        .forEach(([row, col], i) => {
          draft.grid[row][col] = action.value[i];
        });
      break;
    }

    case "updateClue":
      draft.clues[action.key] = action.value;
      break;

    default:
      console.error("invalid dispatch action");
      break;
  }
}

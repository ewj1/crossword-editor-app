import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { Cell } from "./Cell";
import { WordSuggestions } from "./WordSuggestions";

const CELL_SIZE_REM = 2.5;

function gridReducer(draft, action) {
  if (!draft.selectedCell && action.type !== "selected") {
    return;
  }
  const rowCount = draft.grid.length;
  const colCount = draft.grid[0].length;
  const row = draft.selectedCell?.row;
  const col = draft.selectedCell?.col;
  switch (action.type) {
    case "deleted":
      if (draft.grid[row][col] === ".") {
        draft.grid[rowCount - 1 - row][colCount - 1 - col] = "";
      }
      draft.grid[row][col] = "";

      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        rowCount,
        colCount,
        draft.isHorizontal,
        "backward"
      );
      break;
    case "inserted":
      draft.grid[row][col] = action.value;
      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        rowCount,
        colCount,
        draft.isHorizontal,
        "forward"
      );
      break;
    case "selected":
      draft.selectedCell = { row: action.row, col: action.col };
      break;
    case "toggledDirection":
      draft.isHorizontal = action.value;
      break;
    case "moved":
      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        rowCount,
        colCount,
        draft.isHorizontal,
        action.direction === "right" || action.direction === "down"
          ? "forward"
          : "backward"
      );
      break;
    case "insertedBox":
      draft.grid[row][col] = ".";
      draft.grid[rowCount - 1 - row][colCount - 1 - col] = ".";

      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        rowCount,
        colCount,
        draft.isHorizontal,
        "forward"
      );
  }
}

const wrap = (value, max) => (value + max) % max;

function calcNextCell(
  { row, col },
  rowCount,
  colCount,
  isHorizontal,
  direction
) {
  let newRow = row;
  let newCol = col;
  const isForward = direction === "forward";

  if (isHorizontal) {
    newCol = wrap(col + (isForward ? 1 : -1), colCount);

    if (isForward && newCol === 0) {
      newRow = wrap(row + 1, rowCount);
    } else if (!isForward && newCol === colCount - 1) {
      newRow = wrap(row - 1, rowCount);
    }
  }
  if (!isHorizontal) {
    newRow = wrap(row + (isForward ? 1 : -1), rowCount);

    if (isForward && newRow === 0) {
      newCol = wrap(col + 1, colCount);
    } else if (!isForward && newRow === rowCount - 1) {
      newCol = wrap(col - 1, colCount);
    }
  }

  return { row: newRow, col: newCol };
}

export function Grid({ numRows, numCols }) {
  const initialState = {
    grid: createGrid(numRows, numCols),
    selectedCell: null,
    isHorizontal: true,
  };
  const [state, dispatch] = useImmerReducer(gridReducer, initialState);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!state.selectedCell) return;
      const key = e.key.toUpperCase();

      switch (true) {
        case /^[A-Z]$/.test(key):
          dispatch({ type: "inserted", value: key });
          break;
        case key === "BACKSPACE":
          dispatch({ type: "deleted" });
          break;
        case key === " ":
          dispatch({ type: "toggledDirection", value: !state.isHorizontal });
          break;
        case key === "ARROWRIGHT":
          if (state.isHorizontal) {
            dispatch({ type: "moved", direction: "right" });
          } else {
            dispatch({ type: "toggledDirection", value: true });
          }
          break;
        case key === "ARROWLEFT":
          if (state.isHorizontal) {
            dispatch({ type: "moved", direction: "left" });
          } else {
            dispatch({ type: "toggledDirection", value: true });
          }
          break;
        case key === "ARROWUP":
          if (!state.isHorizontal) {
            dispatch({ type: "moved", direction: "up" });
          } else {
            dispatch({ type: "toggledDirection", value: false });
          }
          break;
        case key === "ARROWDOWN":
          if (!state.isHorizontal) {
            dispatch({ type: "moved", direction: "down" });
          } else {
            dispatch({ type: "toggledDirection", value: false });
          }
          break;
        case key === ".":
          dispatch({ type: "insertedBox" });
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isHorizontal, state.selectedCell, dispatch]);

  function createGrid(numRows, numCols) {
    return Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => {
        return "";
      })
    );
  }
  //DETERMINE HIGHLIGHTED CELLS

  function findOrderedHighlightedCells() {
    const orderedHighlightedCells = [];
    if (!state.selectedCell) return;
    const { row: selRow, col: selCol } = state.selectedCell;
    if (state.grid[selRow][selCol] === ".") return;

    if (state.isHorizontal) {
      for (let c = selCol; c >= 0 && state.grid[selRow][c] !== "."; c--) {
        orderedHighlightedCells.unshift(`${selRow}-${c}`);
      }
      for (
        let c = selCol + 1;
        c < numCols && state.grid[selRow][c] !== ".";
        c++
      ) {
        orderedHighlightedCells.push(`${selRow}-${c}`);
      }
    }
    if (!state.isHorizontal) {
      for (let r = selRow; r >= 0 && state.grid[r][selCol] !== "."; r--) {
        orderedHighlightedCells.unshift(`${r}-${selCol}`);
      }
      for (
        let r = selRow + 1;
        r < numRows && state.grid[r][selCol] !== ".";
        r++
      ) {
        orderedHighlightedCells.push(`${r}-${selCol}`);
      }
    }
    return orderedHighlightedCells;
  }
  const highlightedCells = new Set(findOrderedHighlightedCells());

  let number = 0;
  //DETERMINE CELL NUMBERING
  function calcNumber(r, c) {
    const cell = state.grid[r][c];
    if (cell === ".") return 0;

    // Check if this cell can start an across word
    const isStartAcross =
      (c === 0 || state.grid[r][c - 1] === ".") &&
      c + 1 < numCols &&
      state.grid[r][c + 1] !== ".";

    // Check if this cell can start a down word
    const isStartDown =
      (r === 0 || state.grid[r - 1][c] === ".") &&
      r + 1 < numRows &&
      state.grid[r + 1][c] !== ".";

    if (isStartAcross || isStartDown) {
      return ++number;
    }

    return 0;
  }
  return (
    <>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${numCols}, ${CELL_SIZE_REM}rem)`,
        }}
      >
        {state.grid.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cellSizeRem={CELL_SIZE_REM}
              value={cell}
              number={calcNumber(r, c)}
              isReciprocal={
                numRows - 1 - state.selectedCell?.row === r &&
                numCols - 1 - state.selectedCell?.col === c
              }
              isSelected={
                state.selectedCell?.row === r && state.selectedCell?.col === c
              }
              isHighlighted={highlightedCells.has(`${r}-${c}`)}
              isRightEdge={c === numCols - 1}
              isBottomEdge={r === numRows - 1}
              handleClick={() => {
                if (
                  state.selectedCell?.row === r &&
                  state.selectedCell?.col === c
                ) {
                  dispatch({
                    type: "toggledDirection",
                    value: !state.isHorizontal,
                  });
                } else {
                  dispatch({ type: "selected", row: r, col: c });
                }
              }}
            />
          ))
        )}
      </div>
      <WordSuggestions
        pattern={Array.from(highlightedCells)
          .map((s) => s.split("-"))
          .map(([r, c]) => state.grid[Number(r)][Number(c)])
          .map((val) => (val === "" ? "?" : val))
          .join("")}
      />
    </>
  );
}

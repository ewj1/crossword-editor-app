import { useEffect, useRef } from "react";
import { useImmerReducer } from "use-immer";
import { Cell } from "./Cell";
import { WordSuggestions } from "./WordSuggestions";

const CELL_SIZE_REM = 2.5;

function gridReducer(draft, action) {
  if (!draft.selectedCell && action.type !== "selectedCell") {
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
        "backward",
      );
      break;
    case "insertedLetter":
      draft.grid[row][col] = action.value;
      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        rowCount,
        colCount,
        draft.isHorizontal,
        "forward",
      );
      break;
    case "selectedCell":
      draft.selectedCell = { row: action.row, col: action.col };
      break;
    case "clearedSelection":
      draft.selectedCell = null;
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
          : "backward",
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
        "forward",
      );
      break;
    case "selectedSuggestion":
      {
        findOrderedHighlightedCells(draft)
          .map((cell) => cell.split("-"))
          .forEach(([row, col], i) => {
            draft.grid[row][col] = action.value[i];
          });
      }
      break;
    default:
      console.error("invalid dispatch action");
      break;
  }
}

const wrap = (value, max) => (value + max) % max;

function calcNextCell(
  { row, col },
  rowCount,
  colCount,
  isHorizontal,
  direction,
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

function createGrid(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => {
      return "";
    }),
  );
}

function findOrderedHighlightedCells(state) {
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
      c < state.grid.length && state.grid[selRow][c] !== ".";
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
      r < state.grid.length && state.grid[r][selCol] !== ".";
      r++
    ) {
      orderedHighlightedCells.push(`${r}-${selCol}`);
    }
  }
  return orderedHighlightedCells;
}

export function Grid({ size }) {
  const initialState = {
    grid: createGrid(size),
    selectedCell: null,
    isHorizontal: true,
  };
  const [state, dispatch] = useImmerReducer(gridReducer, initialState);
  const gridRef = useRef(null);
  const wordSuggestionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !gridRef.current?.contains(event.target) &&
        !wordSuggestionsRef.current?.contains(event.target)
      ) {
        dispatch({ type: "clearedSelection" });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!state.selectedCell) return;
      const key = e.key.toUpperCase();

      switch (true) {
        case /^[A-Z]$/.test(key):
          dispatch({ type: "insertedLetter", value: key });
          break;
        case key === "BACKSPACE":
          dispatch({ type: "deleted" });
          break;
        case key === " ":
          e.preventDefault();
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

  //DETERMINE HIGHLIGHTED CELLS
  const highlightedCells = new Set(findOrderedHighlightedCells(state));

  //DETERMINE CELL NUMBERING
  let number = 0;
  function calcNumber(r, c) {
    const cell = state.grid[r][c];
    if (cell === ".") return 0;

    // Check if this cell can start an across word
    const isStartAcross =
      (c === 0 || state.grid[r][c - 1] === ".") &&
      c + 1 < size &&
      state.grid[r][c + 1] !== ".";

    // Check if this cell can start a down word
    const isStartDown =
      (r === 0 || state.grid[r - 1][c] === ".") &&
      r + 1 < size &&
      state.grid[r + 1][c] !== ".";

    if (isStartAcross || isStartDown) {
      return ++number;
    }

    return 0;
  }
  return (
    <>
      <div className="flex gap-4">
        <div
          className="grid gap-0"
          ref={gridRef}
          style={{
            gridTemplateColumns: `repeat(${size}, ${CELL_SIZE_REM}rem)`,
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
                  size - 1 - state.selectedCell?.row === r &&
                  size - 1 - state.selectedCell?.col === c
                }
                isSelected={
                  state.selectedCell?.row === r && state.selectedCell?.col === c
                }
                isHighlighted={highlightedCells.has(`${r}-${c}`)}
                isRightEdge={c === size - 1}
                isBottomEdge={r === size - 1}
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
                    dispatch({ type: "selectedCell", row: r, col: c });
                  }
                }}
              />
            )),
          )}
        </div>
        <WordSuggestions
          ref={wordSuggestionsRef}
          pattern={Array.from(highlightedCells)
            .map((cell) => cell.split("-"))
            .map(([row, col]) => state.grid[row][col])
            .map((val) => (val === "" ? "?" : val))
            .join("")}
          dispatch={dispatch}
        />
      </div>
    </>
  );
}

import { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import { Cell } from "./Cell";

const CELL_SIZE_REM = 2.5;

function gridReducer(draft, action) {
  if (!draft.selectedCell && action.type !== "selected") {
    return;
  }
  const rowCount = draft.contents.length;
  const colCount = draft.contents[0].length;
  const row = draft.selectedCell?.row;
  const col = draft.selectedCell?.col;
  switch (action.type) {
    case "deleted":
      if (draft.contents[row][col] === ".") {
        draft.contents[rowCount - 1 - row][colCount - 1 - col] = "";
      }
      draft.contents[row][col] = "";

      draft.selectedCell = calcNextCell(
        draft.selectedCell,
        rowCount,
        colCount,
        draft.isHorizontal,
        "backward"
      );
      break;
    case "inserted":
      draft.contents[row][col] = action.value;
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
      draft.contents[row][col] = ".";
      draft.contents[rowCount - 1 - row][colCount - 1 - col] = ".";

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
  const initialGrid = {
    contents: createGrid(numRows, numCols),
    selectedCell: null,
    isHorizontal: true,
  };
  const [grid, dispatch] = useImmerReducer(gridReducer, initialGrid);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!grid.selectedCell) return;
      const key = e.key.toUpperCase();

      switch (true) {
        case /^[A-Z]$/.test(key):
          dispatch({ type: "inserted", value: key });
          break;
        case key === "BACKSPACE":
          dispatch({ type: "deleted" });
          break;
        case key === " ":
          dispatch({ type: "toggledDirection", value: !grid.isHorizontal });
          break;
        case key === "ARROWRIGHT":
          if (grid.isHorizontal) {
            dispatch({ type: "moved", direction: "right" });
          } else {
            dispatch({ type: "toggledDirection", value: true });
          }
          break;
        case key === "ARROWLEFT":
          if (grid.isHorizontal) {
            dispatch({ type: "moved", direction: "left" });
          } else {
            dispatch({ type: "toggledDirection", value: true });
          }
          break;
        case key === "ARROWUP":
          if (!grid.isHorizontal) {
            dispatch({ type: "moved", direction: "up" });
          } else {
            dispatch({ type: "toggledDirection", value: false });
          }
          break;
        case key === "ARROWDOWN":
          if (!grid.isHorizontal) {
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
  }, [grid.isHorizontal, grid.selectedCell, dispatch]);

  function createGrid(numRows, numCols) {
    return Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => {
        return "";
      })
    );
  }

  const highlightedCells = new Set();

  if (grid.selectedCell) {
    const { row: selRow, col: selCol } = grid.selectedCell;

    if (grid.isHorizontal) {
      for (let c = selCol; c >= 0 && grid.contents[selRow][c] !== "."; c--) {
        highlightedCells.add(`${selRow}-${c}`);
      }
      for (
        let c = selCol + 1;
        c < numCols && grid.contents[selRow][c] !== ".";
        c++
      ) {
        highlightedCells.add(`${selRow}-${c}`);
      }
    }
    if (!grid.isHorizontal) {
      for (let r = selRow; r >= 0 && grid.contents[r][selCol] !== "."; r--) {
        highlightedCells.add(`${r}-${selCol}`);
      }
      for (
        let r = selRow + 1;
        r < numRows && grid.contents[r][selCol] !== ".";
        r++
      ) {
        highlightedCells.add(`${r}-${selCol}`);
      }
    }
  }

  return (
    <>
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${numCols}, ${CELL_SIZE_REM}rem)`,
        }}
      >
        {grid.contents.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cellSizeRem={CELL_SIZE_REM}
              value={cell}
              isReciprocal={
                numRows - 1 - grid.selectedCell?.row === r &&
                numCols - 1 - grid.selectedCell?.col === c
              }
              isSelected={
                grid.selectedCell?.row === r && grid.selectedCell?.col === c
              }
              isHighlighted={highlightedCells.has(`${r}-${c}`)}
              isRightEdge={c === numCols - 1}
              isBottomEdge={r === numRows - 1}
              handleClick={() => {
                if (
                  grid.selectedCell?.row === r &&
                  grid.selectedCell?.col === c
                ) {
                  dispatch({
                    type: "toggledDirection",
                    value: !grid.isHorizontal,
                  });
                } else {
                  dispatch({ type: "selected", row: r, col: c });
                }
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

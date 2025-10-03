import { useEffect, useRef, useMemo } from "react";
import {
  findOrderedHighlightedCells,
  calculateNumberMap,
  makeClueKey,
} from "../utils/gridUtils";

import { Cell } from "./Cell";
import { WordSuggestions } from "./WordSuggestions";
import { EntryLabel } from "./EntryLabel";

const CELL_SIZE_REM = 2.5;

//MAIN COMPONENT
export function Grid({ state, dispatch }) {
  const size = state.grid.length;
  const gridRef = useRef(null);
  const wordSuggestionsRef = useRef(null);

  //MEMOIZED CALCULATIONS
  const highlightedCells = useMemo(
    () =>
      findOrderedHighlightedCells(
        state.grid,
        state.selectedCell,
        state.isHorizontal,
      ),
    [state.grid, state.selectedCell, state.isHorizontal],
  );

  const numberMap = useMemo(
    () => calculateNumberMap(state.grid, size),
    [state.grid, size],
  );

  const highlightedCellsSet = useMemo(
    () => new Set(highlightedCells),
    [highlightedCells],
  );

  //CLUE HELPERS

  function updateClue(row, col, isHorizontal, text) {
    dispatch({
      type: "updateClue",
      key: makeClueKey(row, col, isHorizontal),
      value: text,
    });
  }

  function getClue(row, col, isHorizontal) {
    const key = makeClueKey(row, col, isHorizontal);
    return state.clues[key];
  }

  //EFFECTS
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !gridRef.current?.contains(event.target) &&
        !wordSuggestionsRef.current?.contains(event.target)
      ) {
        dispatch({ type: "deactivateGrid" });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!state.gridActive) return;
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
  }, [state.gridActive, state.isHorizontal, dispatch]);

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
                number={numberMap.get(`${r}-${c}`)}
                isReciprocal={
                  size - 1 - state.selectedCell?.row === r &&
                  size - 1 - state.selectedCell?.col === c
                }
                isSelected={
                  state.selectedCell?.row === r && state.selectedCell?.col === c
                }
                isHighlighted={highlightedCellsSet.has(`${r}-${c}`)}
                gridActive={state.gridActive}
                isRightEdge={c === size - 1}
                isBottomEdge={r === size - 1}
                handleClick={() => {
                  if (
                    state.gridActive &&
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
        <div className="flex flex-col">
          <EntryLabel
            selectedIndex={
              highlightedCells && numberMap.get(highlightedCells[0])
            }
            isHorizontal={state.isHorizontal}
            clue={
              highlightedCells &&
              getClue(...highlightedCells[0].split("-"), state.isHorizontal)
            }
            updateClue={(text) =>
              updateClue(
                ...highlightedCells[0].split("-"),
                state.isHorizontal,
                text,
              )
            }
          />
          <WordSuggestions
            ref={wordSuggestionsRef}
            pattern={highlightedCells
              ?.map((cell) => cell.split("-"))
              .map(([row, col]) => state.grid[row][col])
              .map((val) => (val === "" ? "?" : val))
              .join("")}
            dispatch={dispatch}
          />
        </div>
      </div>
    </>
  );
}

export function wrap(value, max) {
  return (value + max) % max;
}

export function calcNextCell({ row, col }, size, isHorizontal, direction) {
  let newRow = row;
  let newCol = col;
  const isForward = direction === "forward";

  if (isHorizontal) {
    newCol = wrap(col + (isForward ? 1 : -1), size);

    if (isForward && newCol === 0) {
      newRow = wrap(row + 1, size);
    } else if (!isForward && newCol === size - 1) {
      newRow = wrap(row - 1, size);
    }
  }
  if (!isHorizontal) {
    newRow = wrap(row + (isForward ? 1 : -1), size);

    if (isForward && newRow === 0) {
      newCol = wrap(col + 1, size);
    } else if (!isForward && newRow === size - 1) {
      newCol = wrap(col - 1, size);
    }
  }

  return { row: newRow, col: newCol };
}

export function createGrid(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => {
      return "";
    }),
  );
}

export function createClues(size) {
  const clues = {};
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      clues[makeClueKey(r, c, true)] = "(blank clue)";
      clues[makeClueKey(r, c, false)] = "(blank clue)";
    }
  }
  return clues;
}

export function makeClueKey(row, col, isHorizontal) {
  return `${row}-${col}-${isHorizontal ? "a" : "d"}`;
}

export function findOrderedHighlightedCells(grid, selectedCell, isHorizontal) {
  const orderedHighlightedCells = [];
  if (!selectedCell) return;
  const { row: selRow, col: selCol } = selectedCell;
  if (grid[selRow][selCol] === ".") return;

  if (isHorizontal) {
    for (let c = selCol; c >= 0 && grid[selRow][c] !== "."; c--) {
      orderedHighlightedCells.unshift(`${selRow}-${c}`);
    }
    for (let c = selCol + 1; c < grid.length && grid[selRow][c] !== "."; c++) {
      orderedHighlightedCells.push(`${selRow}-${c}`);
    }
  }
  if (!isHorizontal) {
    for (let r = selRow; r >= 0 && grid[r][selCol] !== "."; r--) {
      orderedHighlightedCells.unshift(`${r}-${selCol}`);
    }
    for (let r = selRow + 1; r < grid.length && grid[r][selCol] !== "."; r++) {
      orderedHighlightedCells.push(`${r}-${selCol}`);
    }
  }
  return orderedHighlightedCells;
}

export function calculateNumberMap(grid, size) {
  const numberMap = new Map();
  let currentNum = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid.length; c++) {
      const cell = grid[r][c];
      if (cell === ".") {
        numberMap.set(`${r}-${c}`, 0);
        continue;
      }
      const isStartAcross =
        (c === 0 || grid[r][c - 1] === ".") &&
        c + 1 < size &&
        grid[r][c + 1] !== ".";

      const isStartDown =
        (r === 0 || grid[r - 1][c] === ".") &&
        r + 1 < size &&
        grid[r + 1][c] !== ".";

      if (isStartAcross || isStartDown) {
        numberMap.set(`${r}-${c}`, ++currentNum);
      } else {
        numberMap.set(`${r}-${c}`, 0);
      }
    }
  }
  return numberMap;
}

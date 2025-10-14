import { calculateNumMap, makeClueKey } from "./gridUtils";

export async function generatePDF(grid, clues) {
  //lazy-load
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const clueList = { across: {}, down: {} };
  const coordsToNum = calculateNumMap(grid);
  const doc = new jsPDF();
  doc.setFillColor(0, 0, 0); // RGB black
  // Draw crossword grid manually
  const cellSize = 10;
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      doc.setFontSize(12);
      const x = 10 + j * cellSize;
      const y = 10 + i * cellSize;
      doc.rect(x, y, cellSize, cellSize, cell === "." ? "F" : "S");
      doc.text(cell, x + cellSize / 2, y + cellSize / 2, {
        align: "center",
        baseline: "middle",
      });
      const num = coordsToNum.get(`${i}-${j}`);
      if (num) {
        doc.setFontSize(6);
        doc.text(String(num), x + 1, y + 4);

        const isStartAcross =
          (j === 0 || grid[i][j - 1] === ".") &&
          j + 1 < grid.length &&
          grid[i][j + 1] !== ".";

        const isStartDown =
          (i === 0 || grid[i - 1][j] === ".") &&
          i + 1 < grid.length &&
          grid[i + 1][j] !== ".";
        if (isStartAcross) {
          clueList.across.num = clues[makeClueKey(i, j, true)];
        }
        if (isStartDown) {
          clueList.down.num = clues[makeClueKey(i, j, false)];
        }
      }
    });
  });

  // Draw clues as a table using autoTable (optional)
  console.log("clues", clues);
  console.log("clueList", clueList);
  // if (crosswordData.across.length > 0) {
  //   autoTable(doc, {
  //     startY: 10 + crosswordData.grid.length * 10 + 10,
  //     head: [["Clues"]],
  //     body: crosswordData.across.map((clue, idx) => [`${idx + 1}. ${clue}`]),
  //     theme: "plain",
  //   });
  // }

  doc.save("crossword.pdf");
}

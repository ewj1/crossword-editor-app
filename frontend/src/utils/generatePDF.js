import { calculateNumMap, makeClueKey } from "./gridUtils";

export async function generatePDF(grid, clues, title, answerKey) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const clueList = { across: new Map(), down: new Map() };
  const coordsToNum = calculateNumMap(grid);
  const doc = new jsPDF();
  doc.setFillColor(0, 0, 0);
  const cellSize = 10;
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      doc.setFontSize(14);
      const x = 10 + j * cellSize;
      const y = 10 + i * cellSize;
      doc.rect(x, y, cellSize, cellSize, cell === "." ? "F" : "S");
      if (answerKey) {
        doc.text(cell, x + cellSize / 2, y + cellSize / 2, {
          align: "center",
          baseline: "middle",
        });
      }
      const num = coordsToNum.get(`${i}-${j}`);
      if (num) {
        doc.setFontSize(6);
        doc.text(String(num), x + cellSize / 20, y + cellSize / 5);

        const isStartAcross =
          (j === 0 || grid[i][j - 1] === ".") &&
          j + 1 < grid.length &&
          grid[i][j + 1] !== ".";

        const isStartDown =
          (i === 0 || grid[i - 1][j] === ".") &&
          i + 1 < grid.length &&
          grid[i + 1][j] !== ".";
        if (isStartAcross) {
          clueList.across.set(num, clues[makeClueKey(i, j, true)]);
        }
        if (isStartDown) {
          clueList.down.set(num, clues[makeClueKey(i, j, false)]);
        }
      }
    });
  });

  const pageNumber = doc.internal.getNumberOfPages();
  autoTable(doc, {
    body: Array.from(clueList.across).map(([num, clue]) => [`${num}. ${clue}`]),
    startY: grid.length * cellSize + 10,
    head: [["Across"]],
    showHead: "firstPage",
    style: { overflow: "linebreak" },
    margin: { right: 107 },
    theme: "plain",
  });
  doc.setPage(pageNumber);
  autoTable(doc, {
    body: Array.from(clueList.down).map(([num, clue]) => [`${num}. ${clue}`]),
    startY: grid.length * cellSize + 10,
    head: [["Down"]],
    showHead: "firstPage",
    style: { overflow: "linebreak" },
    margin: { left: 107 },
    theme: "plain",
  });

  doc.save(`${title}.pdf`);
}

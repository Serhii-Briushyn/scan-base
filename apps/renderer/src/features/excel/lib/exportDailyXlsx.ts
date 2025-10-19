import ExcelJS from "exceljs";

import { MaterialRecord } from "@shared/types/material";

function materialCells(m: MaterialRecord["material"]) {
  return [
    m.materialId,
    m.steelGrade,
    m.treatmentCode,
    m.sourceNestingId ?? "",
    m.thickness,
    m.width,
    m.length,
  ];
}

export async function exportDailyXlsx(date: string, items: MaterialRecord[]) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("StockWise");

  const HEADER = [
    "Dátum",
    "Kód položky",
    "Oceľ",
    "Spracovanie",
    "Priradeny nesting",
    "Hrúbka",
    "Šírka",
    "Dĺžka",
  ] as const;

  ws.columns = HEADER.map((h) => ({ header: h, width: 16 }));

  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFFF99" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFCCCCCC" } },
      bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
    };
  });
  ws.views = [{ state: "frozen", ySplit: 1 }];

  ws.columns.forEach((col) => {
    col.alignment = { horizontal: "left" };
  });

  for (const rec of items) {
    const jsDate = new Date(`${rec.date}T00:00:00`);
    const row = [jsDate, ...materialCells(rec.material)];
    ws.addRow(row);
  }

  const dateCol = ws.getColumn(1);
  dateCol.numFmt = "yyyy-mm-dd";

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `stockwise_${date}.xlsx`;
  a.click();

  URL.revokeObjectURL(a.href);
}

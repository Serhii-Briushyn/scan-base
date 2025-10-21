import ExcelJS from "exceljs";

import { excelDateFromYMD, formatYMD } from "@shared/utils/date";

import type { MaterialRecord } from "@shared/types/material";

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
  const ws = wb.addWorksheet("ScanBase");

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
    const jsDate = excelDateFromYMD(rec.date);
    const row = [jsDate, ...materialCells(rec.material)];
    ws.addRow(row);
  }

  const dateCol = ws.getColumn(1);
  dateCol.numFmt = "dd-mm-yyyy";

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `materials_${formatYMD(date, "-")}.xlsx`;
  a.click();

  URL.revokeObjectURL(a.href);
}

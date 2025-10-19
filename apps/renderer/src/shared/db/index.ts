import Dexie, { type Table } from "dexie";

import { MaterialRecord } from "@shared/types/material";

class AppDB extends Dexie {
  records!: Table<MaterialRecord, string>;
  constructor() {
    super("scan-base");
    this.version(1).stores({
      records: "id, date, material.materialId, createdAt",
    });
  }
}
export const db = new AppDB();

import { ScanParsed } from "@features/material/types/scan";

export type MaterialRecord = {
  id: string;
  date: string;
  material: ScanParsed;
  createdAt: number;
};

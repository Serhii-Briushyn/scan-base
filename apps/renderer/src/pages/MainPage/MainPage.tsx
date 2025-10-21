import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { showErrorToast } from "@shared/utils/showErrorToast";
import { ymd } from "@shared/utils/date";
import { db } from "@shared/db";
import {
  MSG_SAVE_ERR,
  MSG_SCANNER_LOCKED,
} from "@features/material/lib/messages";
import { RecordsSection } from "./components/RecordsSection";
import { ScanPanel } from "./components/ScanPanel";
import styles from "./MainPage.module.css";

import type { ScanParsed } from "@features/material/types/scan";

export const MainPage = () => {
  const [date, setDate] = useState(ymd());
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const today = ymd();
  const locked = date !== today;

  const handleParsed = useCallback(
    async (item: ScanParsed) => {
      if (locked) {
        showErrorToast(MSG_SCANNER_LOCKED);
        return;
      }
      const id = crypto.randomUUID();
      try {
        await db.records.add({
          id,
          date: today,
          material: item,
          createdAt: Date.now(),
        });
        setLastAddedId(id);
        toast.success("Uložené ✅");
      } catch (err) {
        showErrorToast(err, MSG_SAVE_ERR);
      }
    },
    [locked, today]
  );

  return (
    <main className={styles.main}>
      <ScanPanel
        locked={locked}
        onParsed={handleParsed}
        onError={(err) => showErrorToast(err)}
      />
      <RecordsSection
        date={date}
        lastAddedId={lastAddedId}
        onChangeDate={(d) => {
          setDate(d);
          setLastAddedId(null);
        }}
      />
    </main>
  );
};

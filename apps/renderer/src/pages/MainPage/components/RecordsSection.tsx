import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import toast from "react-hot-toast";

import { db } from "@shared/db";
import { formatYMD, ymd } from "@shared/utils/date";
import { exportDailyXlsx } from "@features/excel/lib/exportDailyXlsx";
import { MSG_DELETE_ERR } from "@features/material/lib/messages";
import { showErrorToast } from "@shared/utils/showErrorToast";

import styles from "../MainPage.module.css";
import { RecordsControls } from "./RecordsControls";
import { RecordsTable } from "./RecordsTable";

export const RecordsSection = () => {
  const [date, setDate] = useState(ymd());

  const handleDelete = async (id: string) => {
    try {
      await db.records.delete(id);
      toast.success("Záznam odstránený");
    } catch (err) {
      showErrorToast(err, MSG_DELETE_ERR);
    }
  };

  const items =
    useLiveQuery(
      async () => {
        const rows = await db.records
          .where("date")
          .equals(date)
          .reverse()
          .sortBy("createdAt");
        return rows.reverse();
      },
      [date],
      []
    ) ?? [];

  return (
    <section className={styles.rec_section}>
      <RecordsControls
        date={date}
        onChangeDate={setDate}
        onExport={() => exportDailyXlsx(date, items)}
        canExport={items.length > 0}
      />
      <p>
        Materiálov za {formatYMD(date, ".")} ({items.length})
      </p>
      <RecordsTable items={items} onDelete={handleDelete} />
    </section>
  );
};

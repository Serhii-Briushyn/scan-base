import { useLiveQuery } from "dexie-react-hooks";
import toast from "react-hot-toast";

import { db } from "@shared/db";
import { formatYMD } from "@shared/utils/date";
import { exportDailyXlsx } from "@features/excel/lib/exportDailyXlsx";
import { MSG_DELETE_ERR } from "@features/material/lib/messages";
import { showErrorToast } from "@shared/utils/showErrorToast";

import { RecordsControls } from "./RecordsControls";
import { RecordsTable } from "./RecordsTable";
import styles from "../MainPage.module.css";

type Props = {
  date: string;
  lastAddedId: string | null;
  onChangeDate: (d: string) => void;
};

export const RecordsSection: React.FC<Props> = ({
  date,
  lastAddedId,
  onChangeDate,
}) => {
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
        onChangeDate={onChangeDate}
        onExport={() => exportDailyXlsx(date, items)}
        canExport={items.length > 0}
      />

      <p>
        Materiálov za {formatYMD(date, ".")} ({items.length})
      </p>

      <RecordsTable
        items={items}
        onDelete={handleDelete}
        lastAddedId={lastAddedId}
      />
    </section>
  );
};

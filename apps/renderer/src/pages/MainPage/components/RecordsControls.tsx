import React from "react";

import styles from "./RecordsControls.module.css";

type Props = {
  date: string;
  onChangeDate: (v: string) => void;
  onExport: () => void;
  canExport: boolean;
};

export const RecordsControls: React.FC<Props> = ({
  date,
  onChangeDate,
  onExport,
  canExport,
}) => {
  return (
    <div className={styles.controls_wrap}>
      <div className={styles.controls_group}>
        <span className={styles.controls_text}>Dátum:</span>

        <input
          className={styles.controls_input}
          type="date"
          value={date}
          onChange={(e) => onChangeDate(e.target.value)}
        />
      </div>

      <button
        className={styles.btn_save}
        onClick={onExport}
        disabled={!canExport}
      >
        Stiahnuť XLSX
      </button>
    </div>
  );
};

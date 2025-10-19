import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

import { db } from "@shared/db";
import { ymd } from "@shared/utils/date";
import { showErrorToast } from "@shared/utils/showErrorToast";
import { MSG_SAVE_ERR } from "@features/material/lib/messages";

import { ScanPanel } from "./ScanPanel";
import styles from "./ScanSection.module.css";

import type { ScanCaptureHandle } from "../../../features/material/components/ScanCapture";
import type { ScanParsed } from "@features/material/types/scan";

export function ScanSection() {
  const scanRef = useRef<ScanCaptureHandle | null>(null);
  const [focused, setFocused] = useState(false);

  const handleParsed = useCallback(async (item: ScanParsed) => {
    try {
      await db.records.add({
        id: crypto.randomUUID(),
        date: ymd(),
        material: item,
        createdAt: Date.now(),
      });
      toast.success("Uložené ✅");
    } catch (err) {
      showErrorToast(err, MSG_SAVE_ERR);
    }
  }, []);

  return (
    <section
      className={styles.scan_section}
      tabIndex={0}
      onPointerDown={(e) => {
        e.preventDefault();
        scanRef.current?.focus();
      }}
      onFocus={() => {
        scanRef.current?.focus();
      }}
    >
      <ScanPanel
        ref={scanRef}
        focused={focused}
        onParsed={handleParsed}
        onError={showErrorToast}
        blurOnParsed={false}
        onFocusChange={setFocused}
      />
    </section>
  );
}

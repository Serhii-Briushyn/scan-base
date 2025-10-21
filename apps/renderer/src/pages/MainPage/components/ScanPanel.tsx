import { useEffect, useState } from "react";
import clsx from "clsx";

import { ScanCapture } from "@features/material/components/ScanCapture";
import styles from "../MainPage.module.css";

import type { ScanParsed } from "@features/material/types/scan";

type Props = {
  locked?: boolean;
  onParsed: (item: ScanParsed) => void;
  onError?: (err: unknown) => void;
};

export const ScanPanel = ({ locked = false, onParsed, onError }: Props) => {
  const [focused, setFocused] = useState(false);
  const [focusTick, setFocusTick] = useState(0);

  const scanLineClass = clsx(
    styles.scanner_line,
    locked ? styles.isLocked : null,
    !locked && focused ? styles.isActive : null
  );

  const requestFocus = () => {
    if (!locked) setFocusTick((x) => x + 1);
  };

  useEffect(() => {
    if (!locked && focused) setFocusTick((x) => x + 1);
  }, [locked, focused]);

  return (
    <section
      className={styles.scan_section}
      tabIndex={locked ? -1 : 0}
      onPointerDown={(e) => {
        if (locked) return;
        e.preventDefault();
        requestFocus();
      }}
      onFocus={requestFocus}
    >
      <p>
        {locked
          ? "Skener je uzamknutý pre iný dátum"
          : focused
          ? "Skener je aktívny - naskenujte materiál"
          : "Kliknite sem a naskenujte materiál"}
      </p>

      <div className={styles.scanner_wrap}>
        <div className={scanLineClass} />
        <ScanCapture
          onParsed={onParsed}
          onError={onError}
          blurOnParsed={false}
          onFocusChange={setFocused}
          focusSignal={focusTick}
          locked={locked}
        />
      </div>
    </section>
  );
};

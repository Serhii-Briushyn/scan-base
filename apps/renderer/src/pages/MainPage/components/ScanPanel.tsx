import { forwardRef } from "react";

import { ScanParsed } from "@features/material/types/scan";
import { ScanCapture } from "@features/material/components/ScanCapture";

import styles from "../MainPage.module.css";

import type { ScanCaptureHandle } from "@features/material/components/ScanCapture";

type Props = {
  focused: boolean;
  onParsed: (item: ScanParsed) => void;
  onError?: (err: unknown) => void;
  blurOnParsed?: boolean;
  onFocusChange?: (focused: boolean) => void;
};

export const ScanPanel = forwardRef<ScanCaptureHandle, Props>(
  ({ focused, onParsed, onError, blurOnParsed, onFocusChange }, ref) => {
    return (
      <>
        <p>
          {focused
            ? "Skener je aktívny - naskenujte materiál"
            : "Kliknite sem a naskenujte materiál"}
        </p>

        <div className={styles.scanner_wrap}>
          <div className={styles.scanner_line} data-scan-line />
          <ScanCapture
            ref={ref}
            onParsed={onParsed}
            onError={onError}
            blurOnParsed={blurOnParsed}
            onFocusChange={onFocusChange}
          />
        </div>
      </>
    );
  }
);

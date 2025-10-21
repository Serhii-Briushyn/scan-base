import { useRef, useEffect } from "react";

import {
  isDimensionLine,
  isMaterialIdLine,
  normalizeLine,
  parseScanLines,
} from "../lib/parse";
import { ScanParseError } from "../lib/errors";
import { MSG_4_5, MSG_BAD_CODE } from "../lib/messages";

import type { ScanParsed } from "../types/scan";

type Props = {
  onParsed: (item: ScanParsed) => void;
  onError?: (err: unknown) => void;
  blurOnParsed?: boolean;
  onFocusChange?: (focused: boolean) => void;
  focusSignal?: number;
  locked?: boolean;
};

const WINDOW_MS = 2000;

export const ScanCapture = ({
  onParsed,
  onError,
  blurOnParsed = false,
  onFocusChange,
  focusSignal = 0,
  locked = false,
}: Props) => {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const bufferRef = useRef<string[]>([]);
  const collectingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = () => {
    clearTimer();
    bufferRef.current = [];
    collectingRef.current = false;
  };

  const startCollect = (first: string) => {
    bufferRef.current = [first];
    collectingRef.current = true;
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      onError?.(new ScanParseError(MSG_4_5));
      reset();
    }, WINDOW_MS);
  };

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!locked) taRef.current?.focus();
  }, [focusSignal, locked]);

  useEffect(() => {
    if (locked) taRef.current?.blur();
  }, [locked]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (locked) return;
    if (e.key !== "Enter") return;

    const el = e.currentTarget;
    const line = normalizeLine(el.value);
    el.value = "";
    if (!line) return;

    if (!collectingRef.current) {
      if (!isMaterialIdLine(line)) {
        onError?.(new ScanParseError(MSG_BAD_CODE));
        reset();
        return;
      }
      startCollect(line);
      return;
    }

    if (isMaterialIdLine(line)) {
      startCollect(line);
      return;
    }

    bufferRef.current.push(line);

    if (isDimensionLine(line)) {
      const buf = bufferRef.current;
      if (buf.length !== 4 && buf.length !== 5) {
        onError?.(new ScanParseError(MSG_4_5));
        reset();
        return;
      }
      try {
        const parsed = parseScanLines(buf);
        onParsed(parsed);
        if (blurOnParsed) el.blur();
      } catch (err) {
        onError?.(err);
      } finally {
        reset();
      }
    }
  };

  return (
    <textarea
      ref={taRef}
      onKeyDown={onKeyDown}
      onFocus={() => !locked && onFocusChange?.(true)}
      onBlur={() => onFocusChange?.(false)}
      tabIndex={locked ? -1 : 0}
      style={{
        position: "fixed",
        width: 1,
        height: 1,
        opacity: 0,
        left: -9999,
        top: -9999,
      }}
    />
  );
};

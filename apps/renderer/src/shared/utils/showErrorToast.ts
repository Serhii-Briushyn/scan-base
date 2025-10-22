import toast from "react-hot-toast";

import {
  MSG_4_5,
  MSG_BAD_CODE,
  MSG_NO_DIMS,
  MSG_DELETE_ERR,
  MSG_SAVE_ERR,
  MSG_SCANNER_LOCKED,
} from "@features/material/lib/messages";
import { playSound } from "./playSound";

const ALLOWED = new Set<string>([
  MSG_4_5,
  MSG_NO_DIMS,
  MSG_SAVE_ERR,
  MSG_DELETE_ERR,
  MSG_BAD_CODE,
  MSG_SCANNER_LOCKED,
]);

export function showErrorToast(err: unknown, fallback?: string) {
  if (err instanceof Error && ALLOWED.has(err.message)) {
    toast.error(err.message, { id: "global-error" });
    playSound("error");
    return;
  }
  console.error(err);
  playSound("error");
  toast.error(fallback ?? "Nastala neočakávaná chyba.", { id: "global-error" });
}

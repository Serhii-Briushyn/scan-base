import toast from "react-hot-toast";

import {
  MSG_4_5,
  MSG_BAD_CODE,
  MSG_NO_DIMS,
  MSG_DELETE_ERR,
  MSG_SAVE_ERR,
} from "@features/material/lib/messages";

const ALLOWED = new Set<string>([
  MSG_4_5,
  MSG_NO_DIMS,
  MSG_SAVE_ERR,
  MSG_DELETE_ERR,
  MSG_BAD_CODE,
]);

export function showErrorToast(err: unknown, fallback?: string) {
  if (err instanceof Error && ALLOWED.has(err.message)) {
    toast.error(err.message, { id: "global-error" });
    return;
  }
  console.error(err);
  toast.error(fallback ?? "Nastala neočakávaná chyba.", { id: "global-error" });
}

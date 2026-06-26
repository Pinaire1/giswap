"use client";

import { useRef } from "react";
import { useDialog } from "@/lib/use-dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(open, onCancel, dialogRef);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <h2 id="confirm-dialog-title" className="font-bold text-white text-lg mb-2">
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="text-gray-400 text-sm mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[#1e2a4a] text-gray-300 hover:text-white hover:border-gray-600 transition font-medium text-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition ${
              destructive
                ? "bg-red-700 hover:bg-red-600 text-white"
                : "bg-blue-700 hover:bg-blue-600 text-white"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

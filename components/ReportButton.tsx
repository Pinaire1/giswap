"use client";

import { useRef, useState } from "react";
import { useDialog } from "@/lib/use-dialog";

const REASONS = [
  "Counterfeit / fake gi",
  "Misleading description",
  "Wrong photos",
  "Spam or duplicate listing",
  "Offensive content",
  "Other",
];

function ReportDialog({
  listingId,
  onClose,
  onSuccess,
}: {
  listingId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useDialog(true, onClose, dialogRef);

  const submit = async () => {
    if (!reason) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason, details }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        setError(data?.error ?? "Failed to submit report");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-dialog-title"
        className="bg-[#111] border border-[#1e2a4a] rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-sm shadow-2xl"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 id="report-dialog-title" className="font-bold text-white">
            Report Listing
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close report dialog"
            className="text-gray-400 hover:text-white text-xl leading-none transition"
          >
            ×
          </button>
        </div>

        <fieldset>
          <legend className="sr-only">Reason for report</legend>
          <div role="radiogroup" aria-labelledby="report-dialog-title" className="space-y-2 mb-4">
            {REASONS.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${
                  reason === r
                    ? "border-red-700 bg-red-950/30 text-red-300"
                    : "border-[#1e2a4a] text-gray-400 hover:border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="sr-only"
                />
                <span className="text-sm">{r}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {reason && (
          <>
            <label htmlFor="report-details" className="sr-only">
              Additional details (optional)
            </label>
            <textarea
              id="report-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Additional details (optional)"
              className="w-full p-3 bg-[#0d0d0d] border border-[#1e2a4a] rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-red-700 resize-none h-20 mb-4"
            />
          </>
        )}

        {error && (
          <p role="alert" className="text-red-400 text-xs mb-3">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={!reason || submitting}
          className="w-full py-3 bg-red-700 hover:bg-red-600 disabled:bg-[#1a1a1a] disabled:text-gray-400 text-white rounded-2xl font-semibold text-sm transition"
        >
          {submitting ? "Submitting…" : "Submit Report"}
        </button>
      </div>
    </div>
  );
}

export default function ReportButton({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p role="status" className="text-xs text-gray-400 text-center">
        Report submitted — we&apos;ll review it shortly.
      </p>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full text-xs text-gray-400 hover:text-red-400 transition py-2"
      >
        Report this listing
      </button>

      {open && (
        <ReportDialog
          listingId={listingId}
          onClose={() => setOpen(false)}
          onSuccess={() => setDone(true)}
        />
      )}
    </>
  );
}

"use client";

import { useState } from "react";

const REASONS = [
  "Counterfeit / fake gi",
  "Misleading description",
  "Wrong photos",
  "Spam or duplicate listing",
  "Offensive content",
  "Other",
];

export default function ReportButton({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

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
        setDone(true);
        setOpen(false);
      } else {
        setError(data?.error ?? "Failed to submit report");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <p className="text-xs text-gray-600 text-center">
        Report submitted — we&apos;ll review it shortly.
      </p>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-xs text-gray-600 hover:text-red-400 transition py-2"
      >
        Report this listing
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#111] border border-[#1e2a4a] rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-white">Report Listing</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-white text-xl leading-none transition"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 mb-4">
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

            {reason && (
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Additional details (optional)"
                className="w-full p-3 bg-[#0d0d0d] border border-[#1e2a4a] rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-700 resize-none h-20 mb-4"
              />
            )}

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            <button
              onClick={submit}
              disabled={!reason || submitting}
              className="w-full py-3 bg-red-700 hover:bg-red-600 disabled:bg-[#1a1a1a] disabled:text-gray-600 text-white rounded-2xl font-semibold text-sm transition"
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

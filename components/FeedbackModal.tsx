"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  "Feature Request",
  "Bug Report",
  "General Feedback",
  "UI/UX",
  "Pricing",
  "Other",
] as const;

interface FeedbackModalProps {
  context?: string;
  triggerLabel?: string;
  open?: boolean;
  onClose?: () => void;
}

export default function FeedbackModal({
  context,
  triggerLabel,
  open: externalOpen,
  onClose,
}: FeedbackModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const isOpen = externalOpen ?? internalOpen;

  const resetForm = () => {
    setCategory("");
    setRating(null);
    setMessage("");
    setDone(false);
    setError("");
  };

  const close = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
    setTimeout(resetForm, 300);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const submit = async () => {
    if (!category || !message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, rating, message: message.trim(), context }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
      } else if (res.status === 429) {
        setError(data.error ?? "Too many submissions — please wait an hour.");
      } else {
        setError(data.error ?? "Failed to submit feedback");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {triggerLabel && (
        <button
          onClick={() => setInternalOpen(true)}
          className="text-xs text-gray-500 hover:text-blue-400 transition"
        >
          {triggerLabel}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#111] border border-[#1e2a4a] rounded-t-3xl sm:rounded-3xl p-6 w-full sm:max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-white">Share Feedback</h3>
                <button
                  onClick={close}
                  className="text-gray-600 hover:text-white text-xl leading-none transition"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {done ? (
                <div className="text-center py-6">
                  <p className="text-2xl mb-3">🙏</p>
                  <p className="text-white font-semibold mb-1">Thanks for your feedback!</p>
                  <p className="text-gray-500 text-sm mb-6">We read every submission.</p>
                  <button
                    onClick={close}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl text-sm font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* Star rating */}
                  <div className="mb-5">
                    <p className="text-xs text-gray-400 mb-2">How would you rate your experience? (optional)</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(rating === star ? null : star)}
                          className={`text-2xl transition ${
                            rating !== null && star <= rating
                              ? "text-amber-400"
                              : "text-gray-700 hover:text-amber-300"
                          }`}
                          aria-label={`${star} star`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-gray-400 mb-2">Category</p>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <label
                          key={cat}
                          className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer border transition text-sm ${
                            category === cat
                              ? "border-blue-600 bg-blue-950/30 text-blue-300"
                              : "border-[#1e2a4a] text-gray-400 hover:border-gray-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="feedback-category"
                            value={cat}
                            checked={category === cat}
                            onChange={() => setCategory(cat)}
                            className="sr-only"
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What would you like to see improved or added?"
                    maxLength={2000}
                    className="w-full p-4 bg-[#0d0d0d] border border-[#1e2a4a] rounded-2xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-600 resize-none h-28 mb-4 transition"
                  />

                  {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

                  <button
                    onClick={submit}
                    disabled={!category || !message.trim() || submitting}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-600 disabled:bg-[#1a1a1a] disabled:text-gray-600 text-white rounded-2xl font-semibold text-sm transition"
                  >
                    {submitting ? "Sending…" : "Send Feedback"}
                  </button>

                  {onClose && (
                    <button
                      onClick={close}
                      className="w-full text-center text-xs text-gray-600 hover:text-gray-400 mt-3 transition"
                    >
                      Skip →
                    </button>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

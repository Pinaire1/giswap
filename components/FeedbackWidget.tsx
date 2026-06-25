"use client";

import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#111] border border-[#1e2a4a] hover:border-blue-600 text-blue-400 hover:text-blue-300 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition"
        aria-label="Share feedback"
      >
        Feedback
      </button>
      <FeedbackModal open={open} context="general" onClose={() => setOpen(false)} />
    </>
  );
}

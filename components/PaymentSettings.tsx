"use client";

import { useState } from "react";

interface PaymentSettingsProps {
  initialPaypal: string | null;
  initialVenmo: string | null;
}

export default function PaymentSettings({
  initialPaypal,
  initialVenmo,
}: PaymentSettingsProps) {
  const [paypal, setPaypal] = useState(initialPaypal ?? "");
  const [venmo, setVenmo] = useState(initialVenmo ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const save = async () => {
    setSaving(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/user/payment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paypalHandle: paypal, venmoHandle: venmo }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data?.error ?? "Failed to save");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Something went wrong");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full p-3 bg-[#0d0d0d] border border-[#1e2a4a] rounded-xl text-white placeholder:text-gray-500 focus:border-blue-600 focus:outline-none transition text-sm";

  return (
    <section className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-6 sm:p-8 mb-10">
      <h2 className="text-xl font-black text-white mb-1">Payment Methods</h2>
      <p className="text-gray-400 text-sm mb-6">
        Buyers will see these on your listings so they can pay you directly.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="paypal-handle" className="block text-sm font-medium text-gray-400 mb-1.5">
            PayPal username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none" aria-hidden="true">
              @
            </span>
            <input
              id="paypal-handle"
              value={paypal}
              onChange={(e) => setPaypal(e.target.value)}
              placeholder="yourpaypal"
              maxLength={64}
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="venmo-handle" className="block text-sm font-medium text-gray-400 mb-1.5">
            Venmo username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none" aria-hidden="true">
              @
            </span>
            <input
              id="venmo-handle"
              value={venmo}
              onChange={(e) => setVenmo(e.target.value)}
              placeholder="yourvenmo"
              maxLength={64}
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          aria-busy={saving}
          className="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 disabled:bg-[#1a1a1a] disabled:text-gray-400 text-white rounded-xl font-semibold text-sm transition"
        >
          {saving ? "Saving…" : "Save Payment Info"}
        </button>

        <div role="status" aria-live="polite">
          {status === "success" && (
            <span className="text-green-400 text-sm">Saved ✓</span>
          )}
          {status === "error" && (
            <span role="alert" className="text-red-400 text-sm">{errorMsg}</span>
          )}
        </div>
      </div>
    </section>
  );
}

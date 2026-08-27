import { useState } from "react";
import { BLOOD_GROUPS } from "../constants";
import { ArrowRight } from "lucide-react";

// Compatibility mapping (recipient -> can receive from)
const COMPAT = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["AB-", "A-", "B-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"],
};

function CompatibilityChart() {
  const [selected, setSelected] = useState("A+");

  return (
    <div>
      {/* Selector */}
      <div className="mb-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {BLOOD_GROUPS.map((bg) => (
          <button
            key={bg}
            onClick={() => setSelected(bg)}
            className={`rounded-xl border py-3 text-center font-display text-sm font-bold transition-all ${
              selected === bg
                ? "border-ink bg-ink text-white shadow-soft"
                : "border-line bg-white text-ink hover:border-ink/40"
            }`}
          >
            {bg}
          </button>
        ))}
      </div>

      <p className="mb-4 text-center text-sm text-ink-soft">
        A patient with{" "}
        <span className="font-bold text-ink">{selected}</span> blood can receive from:
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {COMPAT[selected].map((bg) => (
          <div
            key={bg}
            className="flex items-center justify-center gap-2 rounded-xl border border-success/30 bg-green-50/50 py-4"
          >
            <span className="font-display text-lg font-bold text-success">{bg}</span>
          </div>
        ))}
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-soft">
        <ArrowRight size={16} className="text-success" />
        O- donors are universal donors. AB+ recipients are universal recipients.
      </p>
    </div>
  );
}

export default CompatibilityChart;


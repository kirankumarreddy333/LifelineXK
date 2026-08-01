const bloodColors = {
  "A+": "bg-neutral-900 text-white",
  "A-": "bg-neutral-700 text-white",
  "B+": "bg-neutral-800 text-white",
  "B-": "bg-neutral-600 text-white",
  "O+": "bg-red-600 text-white",
  "O-": "bg-red-700 text-white",
  "AB+": "bg-neutral-500 text-white",
  "AB-": "bg-neutral-400 text-white",
};

function BloodGroupBadge({ group, size = "md" }) {
  const sizeCls = size === "lg" ? "h-14 w-14 text-lg" : "h-11 w-11 text-sm";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl font-display font-bold ${sizeCls} ${
        bloodColors[group] || "bg-neutral-100 text-neutral-700"
      }`}
    >
      {group}
    </span>
  );
}

export default BloodGroupBadge;


import { BadgeCheck } from "lucide-react";

function VerifiedBadge({ size = 16, className = "" }) {
  return (
    <span
      title="Verified Donor"
      className={`inline-flex shrink-0 items-center text-success ${className}`}
    >
      <BadgeCheck size={size} fill="currentColor" stroke="white" strokeWidth={1.5} />
    </span>
  );
}

export default VerifiedBadge;


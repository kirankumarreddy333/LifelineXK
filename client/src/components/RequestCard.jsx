import { MapPin, Phone, Building2, User } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import BloodGroupBadge from "./BloodGroupBadge";

const urgencyTone = {
  normal: "neutral",
  urgent: "warning",
  emergency: "danger",
};

function RequestCard({ request }) {
  const location = [request.city, request.district, request.state]
    .filter(Boolean)
    .join(", ");

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <Card hover className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BloodGroupBadge group={request.bloodGroup} />
          <div>
            <h3 className="font-display text-lg font-bold text-ink">
              {request.patientName}
            </h3>
            <p className="text-xs text-neutral-400">
              {timeAgo(request.createdAt)}
            </p>
          </div>
        </div>
        <Badge tone={urgencyTone[request.urgency] || "neutral"}>
          {request.urgency}
        </Badge>
      </div>

      <div className="mt-4 space-y-2 text-sm text-ink-soft">
        <p className="flex items-center gap-2">
          <Building2 size={15} className="shrink-0" />
          {request.hospitalName || "Hospital TBD"}
        </p>
        {location && (
          <p className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
        <p className="flex items-center gap-2">
          <User size={15} className="shrink-0" />
          {request.contactName} • {request.units} unit{request.units > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-line bg-surface/50 px-4 py-3">
        <div>
          <p className="text-xs text-ink-soft">Contact</p>
          <a
            href={`tel:${request.contactPhone}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-ink"
          >
            <Phone size={14} /> {request.contactPhone}
          </a>
        </div>
        <Badge
          tone={request.status === "open" ? "success" : "neutral"}
          dot
        >
          {request.status}
        </Badge>
      </div>
    </Card>
  );
}

export default RequestCard;


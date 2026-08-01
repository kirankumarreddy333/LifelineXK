import { useState } from "react";
import { MapPin, Phone, Clock, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import Card from "./ui/Card";
import VerifiedBadge from "./VerifiedBadge";
import BloodGroupBadge from "./BloodGroupBadge";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

function DonorCard({ donor }) {
  const [showContact, setShowContact] = useState(false);

  const location = [donor.city, donor.district, donor.state]
    .filter(Boolean)
    .join(", ");

  const lastDonation = donor.lastDonation
    ? new Date(donor.lastDonation)
    : null;
  const daysSince = lastDonation
    ? Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card hover className="p-6">
      <div className="flex items-start gap-4">
        <BloodGroupBadge group={donor.bloodGroup} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate font-display text-lg font-bold text-ink">
              {donor.name}
            </h3>
            {donor.verified && <VerifiedBadge />}
          </div>

          {donor.available && (
            <Badge tone="success" dot className="mt-1.5">
              Available
            </Badge>
          )}
          {!donor.available && (
            <Badge tone="neutral" dot className="mt-1.5">
              Not Available
            </Badge>
          )}
        </div>

        {donor.rewardPoints > 0 && (
          <div className="flex flex-col items-end">
            <span className="flex items-center gap-1 text-xs font-semibold text-ink-soft">
              <Droplets size={13} className="text-danger" />
              {donor.rewardPoints} pts
            </span>
            <span className="mt-1 text-xs text-neutral-400">
              {donor.totalDonations || 0} donations
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2 text-sm text-ink-soft">
        {location && (
          <p className="flex items-center gap-2">
            <MapPin size={15} className="shrink-0" />
            <span className="truncate">{location}</span>
          </p>
        )}
        {daysSince !== null && (
          <p className="flex items-center gap-2">
            <Clock size={15} className="shrink-0" />
            <span>
              Last donation: {daysSince} days ago
            </span>
          </p>
        )}
      </div>

      <div className="mt-5">
        {showContact ? (
          <div className="rounded-xl border border-line bg-surface p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Phone size={15} /> {donor.phone}
            </p>
            <p className="mt-1 text-xs text-ink-soft">Tap to call or message this donor</p>
          </div>
        ) : (
          <Button
            variant="dark"
            size="sm"
            fullWidth
            onClick={() => setShowContact(true)}
          >
            <Phone size={15} />
            Contact Donor
          </Button>
        )}
      </div>
    </Card>
  );
}

export default DonorCard;


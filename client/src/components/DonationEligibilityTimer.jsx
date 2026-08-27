import { useState, useEffect } from "react";
import { Timer, CheckCircle2, CalendarClock } from "lucide-react";

const DAYS_BETWEEN = 90;

function DonationEligibilityTimer({ lastDonation, totalDonations }) {
  const [remaining, setRemaining] = useState(null);
  const [eligible, setEligible] = useState(true);

  useEffect(() => {
    if (!lastDonation) {
      setEligible(true);
      setRemaining(0);
      return;
    }
    const last = new Date(lastDonation);
    const nextEligible = new Date(last.getTime() + DAYS_BETWEEN * 24 * 60 * 60 * 1000);

    const tick = () => {
      const now = new Date();
      const diff = nextEligible - now;
      if (diff <= 0) {
        setEligible(true);
        setRemaining(0);
        return;
      }
      setEligible(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setRemaining({ days, hours });
    };

    tick();
    const interval = setInterval(tick, 60 * 60 * 1000); // update hourly
    return () => clearInterval(interval);
  }, [lastDonation]);

  return (
    <div
      className={`rounded-2xl border p-5 ${
        eligible
          ? "border-success/30 bg-green-50/50"
          : "border-line bg-surface/60"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            eligible ? "bg-success text-white" : "bg-white text-ink shadow-soft"
          }`}
        >
          {eligible ? <CheckCircle2 size={22} /> : <Timer size={22} />}
        </div>
        <div>
          <p className="text-sm font-medium text-ink">
            {eligible ? "You're eligible to donate!" : "Next donation available in"}
          </p>
          {eligible ? (
            <p className="mt-1 text-sm text-ink-soft">
              Thank you for your generosity. Find a request and save a life.
            </p>
          ) : (
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
              {remaining?.days} days{" "}
              <span className="text-base font-medium text-ink-soft">
                {remaining?.hours} hrs
              </span>
            </p>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
            <CalendarClock size={13} />
            Total donations: {totalDonations || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DonationEligibilityTimer;


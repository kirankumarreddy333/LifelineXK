import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Trophy,
  Droplet,
  HeartPulse,
  History,
  Bell,
  CheckCircle2,
  ArrowRight,
  Shield,
  Medal,
} from "lucide-react";

import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import DonationEligibilityTimer from "../components/DonationEligibilityTimer";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { SkeletonGrid } from "../components/ui/Skeleton";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const badgeStyles = [
  "bg-neutral-900 text-white",
  "bg-neutral-700 text-white",
  "bg-red-600 text-white",
  "bg-neutral-600 text-white",
  "bg-neutral-400 text-white",
  "bg-neutral-100 text-neutral-800",
];

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { notifications, markAllRead } = useNotifications();

  const [eligibility, setEligibility] = useState(null);
  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [elig, hist, ach, cat, board] = await Promise.all([
        API.get("/rewards/eligibility"),
        API.get("/rewards/history"),
        API.get("/rewards/achievements"),
        API.get("/rewards/achievements/catalog"),
        API.get("/rewards/leaderboard"),
      ]);
      setEligibility(elig.data);
      setHistory(hist.data);
      setAchievements(ach.data);
      setCatalog(cat.data);
      setLeaderboard(board.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, [isAuthenticated, navigate, fetchAll]);

  if (!isAuthenticated) return null;

  const ownedIds = new Set((achievements || []).map((a) => a._id));

  return (
    <Layout>
      <section className="border-b border-line bg-surface/60 py-12 sm:py-14">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
          >
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                Dashboard
              </h1>
              <p className="mt-2 text-ink-soft">
                Welcome back, {user?.name}!
              </p>
            </div>
            <Button variant="dark" to="/become-donor">
              <Droplet size={16} />
              {user?.isDonor ? "Update Donor Profile" : "Become a Donor"}
            </Button>
          </motion.div>
        </div>
      </section>

      {error ? (
        <div className="container-x py-10">
          <ErrorState message={error} onRetry={fetchAll} />
        </div>
      ) : (
        <>
          {/* Stats */}
          <section className="py-8">
            <div className="container-x grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white">
                  <Award size={20} />
                </span>
                <p className="mt-3 font-display text-2xl font-bold text-ink">
                  {user?.rewardPoints || 0}
                </p>
                <p className="text-xs text-ink-soft">Reward Points</p>
              </Card>
              <Card className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                  <Droplet size={20} />
                </span>
                <p className="mt-3 font-display text-2xl font-bold text-ink">
                  {user?.totalDonations || 0}
                </p>
                <p className="text-xs text-ink-soft">Total Donations</p>
              </Card>
              <Card className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success text-white">
                  <Trophy size={20} />
                </span>
                <p className="mt-3 font-display text-2xl font-bold text-ink">
                  {achievements?.length || 0}
                </p>
                <p className="text-xs text-ink-soft">Achievements</p>
              </Card>
              <Card className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Medal size={20} />
                </span>
                <p className="mt-3 font-display text-2xl font-bold text-ink">
                  #{leaderboard.findIndex((u) => u._id === user?._id) + 1 || "-"}
                </p>
                <p className="text-xs text-ink-soft">Leaderboard Rank</p>
              </Card>
            </div>
          </section>

          <div className="container-x grid gap-8 pb-20 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Eligibility */}
              {eligibility && (
                <DonationEligibilityTimer
                  lastDonation={eligibility.lastDonation}
                  totalDonations={user?.totalDonations}
                />
              )}

              {/* Achievements */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-ink">
                    Achievements
                  </h2>
                  <span className="text-sm text-ink-soft">
                    {achievements?.length}/{catalog?.length} unlocked
                  </span>
                </div>

                {loading ? (
                  <SkeletonGrid count={3} />
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {catalog?.map((ach, i) => {
                      const owned = ownedIds.has(ach._id);
                      return (
                        <div
                          key={ach._id}
                          className={`relative flex items-center gap-3 rounded-2xl border p-4 ${
                            owned
                              ? "border-ink/20 bg-white shadow-soft"
                              : "border-dashed border-line bg-surface/40"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                              badgeStyles[i % badgeStyles.length]
                            } ${!owned ? "opacity-30 grayscale" : ""}`}
                          >
                            {ach.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                              {ach.name}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">
                              {ach.description}
                            </p>
                          </div>
                          {owned && (
                            <CheckCircle2
                              size={16}
                              className="absolute right-2 top-2 text-success"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Donation History */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-ink">
                    Donation History
                  </h2>
                  <span className="flex items-center gap-1.5 text-sm text-ink-soft">
                    <History size={14} /> {history?.length || 0} donations
                  </span>
                </div>

                {loading ? (
                  <SkeletonGrid count={2} />
                ) : history?.length === 0 ? (
                  <EmptyState
                    icon={HeartPulse}
                    title="No donations yet"
                    description="Your donation history will appear here once you make your first donation."
                    action={
                      <Button variant="dark" to="/blood-requests">
                        Find a Request <ArrowRight size={15} />
                      </Button>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    {history?.slice(0, 5).map((h) => (
                      <div
                        key={h._id}
                        className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-soft"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-danger">
                          <Droplet size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink">
                            {h.hospitalName || "Blood Donation"}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {new Date(h.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            {h.recipientName ? ` • For ${h.recipientName}` : ""}
                          </p>
                        </div>
                        <Badge tone="success">
                          +{h.pointsEarned} pts
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Notifications */}
              <Card className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                    <Bell size={18} />
                    Notifications
                  </h3>
                  {notifications?.length > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-medium text-ink-soft hover:text-ink"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {notifications?.length === 0 ? (
                    <p className="py-6 text-center text-sm text-ink-soft">
                      No notifications yet
                    </p>
                  ) : (
                    notifications?.slice(0, 6).map((n) => (
                      <div
                        key={n._id}
                        className={`rounded-xl border p-3 ${
                          n.read ? "border-line bg-white" : "border-ink/15 bg-surface"
                        }`}
                      >
                        <p className="text-sm font-medium text-ink">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Leaderboard */}
              <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <Trophy size={18} />
                  Top Donors
                </h3>
                {loading ? (
                  <SkeletonGrid count={3} />
                ) : (
                  <div className="space-y-3">
                    {leaderboard?.slice(0, 5).map((d, i) => (
                      <div key={d._id} className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            i === 0
                              ? "bg-amber-100 text-amber-700"
                              : i === 1
                              ? "bg-neutral-200 text-neutral-700"
                              : i === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <img
                          src={
                            d.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              d.name || "U"
                            )}&background=111111&color=fff`
                          }
                          alt={d.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">
                            {d.name}
                            {d._id === user?._id && (
                              <span className="ml-1 text-xs text-ink-soft">(you)</span>
                            )}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {d.totalDonations} donations
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-ink">
                          <Award size={12} className="text-amber-500" />
                          {d.rewardPoints}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Donor status */}
              <Card className="p-6">
                <h3 className="mb-3 font-display text-lg font-bold text-ink">
                  Donor Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Registered</span>
                    <Badge tone={user?.isDonor ? "success" : "neutral"}>
                      {user?.isDonor ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-soft">Approved</span>
                    <Badge tone={user?.isApproved ? "success" : "warning"}>
                      {user?.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="mt-3 flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
                    >
                      <span className="flex items-center gap-2">
                        <Shield size={16} /> Admin Panel
                      </span>
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Dashboard;


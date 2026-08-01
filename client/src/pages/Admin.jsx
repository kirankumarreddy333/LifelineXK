import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Droplet,
  Building2,
  Siren,
  BadgeCheck,
  Shield,
  Trash2,
  CheckCircle,
  Search,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { SkeletonGrid } from "../components/ui/Skeleton";
import API from "../api";
import { useAuth } from "../context/AuthContext";

// Simple bar chart (no external chart lib)
function BarChart({ data, labels, color = "#111111" }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-48 items-end justify-between gap-2">
      {data.map((val, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-ink">{val}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-500"
            style={{
              height: `${Math.max((val / max) * 100, 4)}%`,
              backgroundColor: color,
              opacity: 0.8,
            }}
          />
          <span className="text-[10px] text-ink-soft">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart for blood group distribution
function DonutChart({ data, labels }) {
  const total = data.reduce((a, b) => a + b, 0) || 1;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          {data.map((val, i) => {
            const pct = val / total;
            const dash = pct * 100;
            const el = (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                strokeWidth="3.5"
                stroke={["#111111", "#6b7280", "#9ca3af", "#d1d5db", "#dc2626", "#ef4444", "#f9a8a8", "#e5e5e5"][i % 8]}
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl font-bold text-ink">{total}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor:
                  ["#111111", "#6b7280", "#9ca3af", "#d1d5db", "#dc2626", "#ef4444", "#f9a8a8", "#e5e5e5"][i % 8],
              }}
            />
            <span className="text-ink-soft">{label}</span>
            <span className="font-semibold text-ink">{data[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const tabs = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "donors", label: "Donors", icon: Droplet },
  { id: "users", label: "Users", icon: Users },
  { id: "requests", label: "Requests", icon: Siren },
  { id: "hospitals", label: "Hospitals", icon: Building2 },
];

function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [bloodChart, setBloodChart] = useState({ labels: [], data: [] });
  const [trendChart, setTrendChart] = useState({ labels: [], data: [] });
  const [statusChart, setStatusChart] = useState({ labels: [], data: [] });
  const [donors, setDonors] = useState({ donors: [], total: 0 });
  const [users, setUsers] = useState({ users: [], total: 0 });
  const [requests, setRequests] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcast, setBroadcast] = useState({ title: "", message: "" });
  const [broadcasting, setBroadcasting] = useState(false);

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statRes, bgRes, trendRes, statusRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/charts/blood-groups"),
        API.get("/admin/charts/donations-trend"),
        API.get("/admin/charts/requests-status"),
      ]);
      setStats(statRes.data);
      setBloodChart(bgRes.data);
      setTrendChart(trendRes.data);
      setStatusChart(statusRes.data);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("Admin access required");
        navigate("/dashboard");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/donors?q=${searchQ}&limit=50`);
      setDonors(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQ]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/users?q=${searchQ}&limit=50`);
      setUsers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQ]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/requests?limit=50");
      setRequests(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/hospitals");
      setHospitals(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
      return;
    }
    if (activeTab === "overview") fetchOverview();
    if (activeTab === "donors") fetchDonors();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "requests") fetchRequests();
    if (activeTab === "hospitals") fetchHospitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated, user?.role]);

  const handleSearch = () => {
    if (activeTab === "donors") fetchDonors();
    if (activeTab === "users") fetchUsers();
  };

  const approveDonor = async (id) => {
    try {
      await API.put(`/admin/donors/${id}/approve`);
      toast.success("Donor approved");
      fetchDonors();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcast.title.trim() || !broadcast.message.trim()) {
      toast.error("Title and message are required");
      return;
    }
    setBroadcasting(true);
    try {
      await API.post("/admin/broadcast", broadcast);
      toast.success("Broadcast sent to all donors");
      setBroadcastOpen(false);
      setBroadcast({ title: "", message: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBroadcasting(false);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <Layout>
      <section className="border-b border-line bg-ink py-12 sm:py-14">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                <Shield size={14} />
                Admin Panel
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Manage LifelineXK
              </h1>
              <p className="mt-2 text-white/60">
                Overview, monitoring and management of donors, users, requests and hospitals.
              </p>
            </div>
            <Button variant="danger" onClick={() => setBroadcastOpen(true)}>
              <MessageSquare size={16} />
              Broadcast
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-16 z-20 border-b border-line bg-white/90 backdrop-blur-lg sm:top-[72px]">
        <div className="container-x flex gap-1 overflow-x-auto py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-ink text-white shadow-soft"
                  : "text-ink-soft hover:bg-surface hover:text-ink"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <div className="container-x py-10 pb-20">
        {error ? (
          <ErrorState message={error} onRetry={fetchOverview} />
        ) : loading && !stats ? (
          <SkeletonGrid count={4} />
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === "overview" && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { label: "Total Users", value: stats.totalUsers, icon: Users },
                    { label: "Total Donors", value: stats.totalDonors, icon: Droplet },
                    { label: "Verified Donors", value: stats.verifiedDonors, icon: BadgeCheck },
                    { label: "Open Requests", value: stats.openRequests, icon: Siren },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl2 border border-line bg-white p-6 shadow-soft"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink">
                        <s.icon size={20} />
                      </span>
                      <p className="mt-3 font-display text-3xl font-bold text-ink">{s.value}</p>
                      <p className="text-sm text-ink-soft">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="p-6">
                    <h3 className="font-display text-lg font-bold text-ink">
                      Donations (Last 30 Days)
                    </h3>
                    <div className="mt-4">
                      <BarChart data={trendChart.data} labels={trendChart.labels} />
                    </div>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-display text-lg font-bold text-ink">
                      Requests by Status
                    </h3>
                    <div className="mt-4">
                      <DonutChart data={statusChart.data} labels={statusChart.labels} />
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <h3 className="mb-4 font-display text-lg font-bold text-ink">
                    Blood Group Distribution
                  </h3>
                  <BarChart data={bloodChart.data} labels={bloodChart.labels} color="#dc2626" />
                </Card>
              </div>
            )}

            {/* DONORS */}
            {activeTab === "donors" && (
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="relative flex-1 sm:max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search donors..."
                      className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10"
                    />
                  </div>
                  <Button variant="light" size="sm" onClick={handleSearch}>
                    Search
                  </Button>
                </div>

                {donors.donors.length === 0 ? (
                  <EmptyState icon={Droplet} title="No donors found" />
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-soft">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface/60 text-xs uppercase tracking-wider text-ink-soft">
                        <tr>
                          <th className="px-5 py-3.5">Donor</th>
                          <th className="px-5 py-3.5">Blood</th>
                          <th className="px-5 py-3.5">Location</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.donors.map((d) => (
                          <tr key={d._id} className="border-t border-line">
                            <td className="px-5 py-3.5">
                              <p className="font-semibold text-ink">{d.name}</p>
                              <p className="text-xs text-ink-soft">{d.phone}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <Badge tone="dark">{d.bloodGroup}</Badge>
                            </td>
                            <td className="px-5 py-3.5 text-ink-soft">
                              {[d.city, d.district, d.state].filter(Boolean).join(", ") || "—"}
                            </td>
                            <td className="px-5 py-3.5">
                              {d.verified ? (
                                <Badge tone="success" dot>
                                  <span className="flex items-center gap-1">
                                    <BadgeCheck size={12} /> Verified
                                  </span>
                                </Badge>
                              ) : (
                                <Badge tone="warning" dot>
                                  Pending
                                </Badge>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {!d.verified && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => approveDonor(d._id)}
                                >
                                  <CheckCircle size={14} /> Approve
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="relative flex-1 sm:max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      value={searchQ}
                      onChange={(e) => setSearchQ(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search users..."
                      className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10"
                    />
                  </div>
                  <Button variant="light" size="sm" onClick={handleSearch}>
                    Search
                  </Button>
                </div>

                {users.users.length === 0 ? (
                  <EmptyState icon={Users} title="No users found" />
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-soft">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface/60 text-xs uppercase tracking-wider text-ink-soft">
                        <tr>
                          <th className="px-5 py-3.5">User</th>
                          <th className="px-5 py-3.5">Role</th>
                          <th className="px-5 py-3.5">Donor</th>
                          <th className="px-5 py-3.5">Points</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.users.map((u) => (
                          <tr key={u._id} className="border-t border-line">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    u.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      u.name || "U"
                                    )}&background=111111&color=fff`
                                  }
                                  alt={u.name}
                                  className="h-9 w-9 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-ink">{u.name}</p>
                                  <p className="text-xs text-ink-soft">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              {u.role === "admin" ? (
                                <Badge tone="info" dot>Admin</Badge>
                              ) : (
                                <Badge tone="neutral">User</Badge>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              {u.isDonor ? (
                                <Badge tone="success" dot>Yes</Badge>
                              ) : (
                                <Badge tone="neutral">No</Badge>
                              )}
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-ink">
                              {u.rewardPoints}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {u.role !== "admin" && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => deleteUser(u._id, u.name)}
                                >
                                  <Trash2 size={14} /> Delete
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* REQUESTS */}
            {activeTab === "requests" && (
              <div className="space-y-4">
                {requests.length === 0 ? (
                  <EmptyState icon={Siren} title="No requests found" />
                ) : (
                  requests.map((r) => (
                    <div
                      key={r._id}
                      className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink font-display font-bold text-white">
                          {r.bloodGroup}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{r.patientName}</p>
                          <p className="text-xs text-ink-soft">
                            {r.hospitalName || r.location || "Location TBD"} •{" "}
                            {r.units} unit{r.units > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          tone={r.urgency === "emergency" ? "danger" : r.urgency === "urgent" ? "warning" : "neutral"}
                        >
                          {r.urgency}
                        </Badge>
                        <Badge tone={r.status === "open" ? "success" : "neutral"} dot>
                          {r.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* HOSPITALS */}
            {activeTab === "hospitals" && (
              <div className="space-y-4">
                {hospitals.length === 0 ? (
                  <EmptyState icon={Building2} title="No hospitals found" />
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {hospitals.map((h) => (
                      <Card hover key={h._id} className="p-6">
                        <h3 className="font-display text-lg font-bold text-ink">{h.name}</h3>
                        <p className="mt-1 text-sm text-ink-soft">
                          {[h.address, h.city, h.state].filter(Boolean).join(", ")}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          {h.bloodBankAvailable ? (
                            <Badge tone="success" dot>
                              <span className="flex items-center gap-1">
                                <Droplet size={12} /> Blood Bank
                              </span>
                            </Badge>
                          ) : (
                            <Badge tone="neutral">No Blood Bank</Badge>
                          )}
                          {h.verified && (
                            <Badge tone="success" dot>
                              <span className="flex items-center gap-1">
                                <BadgeCheck size={12} /> Verified
                              </span>
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Broadcast Modal */}
      <Modal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} title="Broadcast to All Donors" size="md">
        <form onSubmit={handleBroadcast} className="space-y-5">
          <div>
            <Input
              label="Title *"
              name="title"
              value={broadcast.title}
              onChange={(e) => setBroadcast((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Blood drive this weekend"
            />
          </div>
          <div>
            <textarea
              value={broadcast.message}
              onChange={(e) => setBroadcast((p) => ({ ...p, message: e.target.value }))}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ink/10"
              rows={4}
              placeholder="Message to all donors..."
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
            <AlertTriangle size={14} />
            This will send a notification to every registered donor.
          </div>
          <div className="flex gap-3">
            <Button variant="light" type="button" onClick={() => setBroadcastOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="dark" type="submit" disabled={broadcasting} className="flex-1">
              {broadcasting ? "Sending..." : "Send Broadcast"}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default Admin;


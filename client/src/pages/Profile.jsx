import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Camera,
  MapPin,
  Phone,
  Mail,
  Droplet,
  Trophy,
  Award,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { uploadToFirebase } from "../firebase";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { BLOOD_GROUPS, INDIAN_STATES } from "../constants";

const badgeStyles = [
  "bg-neutral-900 text-white",
  "bg-neutral-700 text-white",
  "bg-red-600 text-white",
  "bg-neutral-600 text-white",
  "bg-neutral-400 text-white",
];

function Profile() {
  const { user, isAuthenticated, updateUser, fetchMe } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchProfileData();
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bloodGroup: user?.bloodGroup || "",
      state: user?.state || "",
      district: user?.district || "",
      city: user?.city || "",
      avatar: user?.avatar || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError("");
    try {
      const [hist, ach] = await Promise.all([
        API.get("/rewards/history"),
        API.get("/rewards/achievements"),
      ]);
      setHistory(hist.data);
      setAchievements(ach.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type/size
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP or GIF images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadToFirebase(
        file,
        `avatars/${user._id}/${Date.now()}_${file.name}`
      );

      await API.put("/auth/profile", { avatar: url });
      updateUser({ avatar: url });
      toast.success("Profile photo updated!");
      await fetchMe();
    } catch (err) {
      toast.error(
        err.message ||
          "Failed to upload. Make sure Firebase Storage is configured and rules allow uploads."
      );
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put("/auth/profile", form);
      updateUser(res.data);
      toast.success("Profile updated successfully");
      setEditOpen(false);
      await fetchMe();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const location = [user?.city, user?.district, user?.state].filter(Boolean).join(", ");

  return (
    <Layout>
      <section className="border-b border-line bg-surface/60 py-12 sm:py-14">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6 text-center"
          >
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "U"
                  )}&background=111111&color=fff&size=256`
                }
                alt={user?.name}
                className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-lift"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white shadow-soft transition-colors hover:bg-neutral-800 disabled:opacity-60"
                title="Upload avatar"
              >
                {uploading ? (
                  <UploadCloud size={16} className="animate-pulse" />
                ) : (
                  <Camera size={16} />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  {user?.name}
                </h1>
                {user?.isApproved && <CheckCircle2 size={22} className="text-success" />}
              </div>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-soft">
                <Mail size={14} /> {user?.email}
              </p>
              {location && (
                <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-ink-soft">
                  <MapPin size={14} /> {location}
                </p>
              )}
              <div className="mt-3 flex items-center justify-center gap-2">
                {user?.bloodGroup && (
                  <Badge tone="dark">{user.bloodGroup}</Badge>
                )}
                {user?.isDonor && (
                  <Badge tone="success" dot>
                    Donor
                  </Badge>
                )}
                {user?.isApproved ? (
                  <Badge tone="success" dot>
                    Verified
                  </Badge>
                ) : (
                  <Badge tone="warning" dot>
                    Pending Verification
                  </Badge>
                )}
                {user?.role === "admin" && (
                  <Badge tone="info" dot>
                    Admin
                  </Badge>
                )}
              </div>
            </div>

            <Button variant="light" size="md" onClick={() => setEditOpen(true)}>
              <Camera size={16} /> Edit Profile
            </Button>
          </motion.div>
        </div>
      </section>

      {error ? (
        <div className="container-x py-10">
          <ErrorState message={error} onRetry={fetchProfileData} />
        </div>
      ) : (
        <div className="container-x grid gap-8 py-10 pb-20 lg:grid-cols-2">
          {/* Personal details */}
          <Card className="p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink">Personal Details</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-xs text-ink-soft">Email</p>
                  <p className="text-sm font-medium text-ink">{user?.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-xs text-ink-soft">Phone</p>
                  <p className="text-sm font-medium text-ink">{user?.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink">
                  <Droplet size={18} />
                </span>
                <div>
                  <p className="text-xs text-ink-soft">Blood Group</p>
                  <p className="text-sm font-medium text-ink">
                    {user?.bloodGroup || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-xs text-ink-soft">Location</p>
                  <p className="text-sm font-medium text-ink">{location || "Not set"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
              <Award size={20} /> Achievements & Badges
            </h2>
            {loading ? (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
                ))}
              </div>
            ) : achievements?.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No achievements yet"
                description="Donate blood to start unlocking achievement badges."
              />
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {achievements?.map((ach, i) => (
                  <div
                    key={ach._id}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 text-center shadow-soft"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${badgeStyles[i % badgeStyles.length]}`}
                    >
                      {ach.icon}
                    </span>
                    <p className="text-xs font-semibold text-ink">{ach.name}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Donation history */}
          <Card className="p-6 sm:p-8 lg:col-span-2">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
              <Droplet size={20} className="text-danger" /> Donation History
            </h2>
            {loading ? (
              <div className="mt-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-neutral-100" />
                ))}
              </div>
            ) : history?.length === 0 ? (
              <EmptyState
                icon={Droplet}
                title="No donations recorded"
                description="Your donation history will show up here."
                action={
                  <Button variant="dark" to="/blood-requests">
                    Find a Request
                  </Button>
                }
              />
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-wider text-ink-soft">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Hospital</th>
                      <th className="px-4 py-3">Recipient</th>
                      <th className="px-4 py-3">Units</th>
                      <th className="px-4 py-3">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history?.map((h) => (
                      <tr key={h._id} className="border-b border-line/60">
                        <td className="px-4 py-3 text-ink-soft">
                          {new Date(h.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">
                          {h.hospitalName || "—"}
                        </td>
                        <td className="px-4 py-3 text-ink-soft">
                          {h.recipientName || "—"}
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">{h.units}</td>
                        <td className="px-4 py-3">
                          <Badge tone="success">+{h.pointsEarned}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Edit profile modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
        size="lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleEditChange}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleEditChange}
            />
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleEditChange}
            />
            <Select
              label="Blood Group"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleEditChange}
            >
              <option value="">Not set</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </Select>
            <Select
              label="State"
              name="state"
              value={form.state}
              onChange={handleEditChange}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Input
              label="District"
              name="district"
              value={form.district}
              onChange={handleEditChange}
            />
            <Input label="City" name="city" value={form.city} onChange={handleEditChange} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="light" type="button" onClick={() => setEditOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="dark" type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default Profile;


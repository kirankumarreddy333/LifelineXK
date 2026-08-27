import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Siren,
  MapPin,
  Building2,
  Phone,
  Clock,
  Plus,
  PhoneCall,
} from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Modal from "../components/ui/Modal";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import BloodGroupBadge from "../components/BloodGroupBadge";
import { SkeletonGrid } from "../components/ui/Skeleton";
import API from "../api";
import { BLOOD_GROUPS, INDIAN_STATES } from "../constants";

const emptyForm = {
  patientName: "",
  bloodGroup: "",
  units: 1,
  hospitalName: "",
  location: "",
  city: "",
  state: "",
  contactName: "",
  contactPhone: "",
  reason: "",
};

function EmergencyBoard() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterBlood, setFilterBlood] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchEmergencies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterBlood) params.set("bloodGroup", filterBlood);
      if (filterCity) params.set("city", filterCity);
      const res = await API.get(`/emergency?${params.toString()}`);
      setEmergencies(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterBlood, filterCity]);

  useEffect(() => {
    fetchEmergencies();
  }, [fetchEmergencies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.bloodGroup) errs.bloodGroup = "Blood group is required";
    if (!form.hospitalName.trim()) errs.hospitalName = "Hospital is required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.contactPhone.trim() || form.contactPhone.length < 10)
      errs.contactPhone = "Valid contact phone required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await API.post("/emergency", form);
      toast.success("🚨 Emergency request posted! Donors are being notified.");
      setModalOpen(false);
      setForm(emptyForm);
      fetchEmergencies();
    } catch (err) {
      toast.error(err.message || "Failed to post emergency");
    } finally {
      setSubmitting(false);
    }
  };

  const expiresIn = (date) => {
    const diff = new Date(date).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days}d remaining` : "Expiring soon";
  };

  return (
    <Layout>
      {/* Emergency header */}
      <section className="bg-ink py-14 sm:py-16">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
          >
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-danger px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                <Siren size={14} className="animate-pulse" />
                Live Emergency Board
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Emergency Blood Requests
              </h1>
              <p className="mt-3 max-w-lg text-white/70">
                Urgent requests posted by hospitals and families. Every minute
                matters — reach out if you can help.
              </p>
            </div>
            <Button variant="danger" size="lg" onClick={() => setModalOpen(true)}>
              <Plus size={18} />
              Post Emergency
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-line bg-white py-5">
        <div className="container-x flex flex-col gap-3 sm:flex-row">
          <Select
            value={filterBlood}
            onChange={(e) => setFilterBlood(e.target.value)}
            className="sm:max-w-[200px]"
          >
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg}>{bg}</option>
            ))}
          </Select>
          <Input
            placeholder="Filter by city..."
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="sm:max-w-[240px]"
          />
        </div>
      </section>

      {/* Emergency list */}
      <section className="bg-surface/60 py-12 sm:py-16">
        <div className="container-x">
          {error ? (
            <ErrorState message={error} onRetry={fetchEmergencies} />
          ) : loading ? (
            <SkeletonGrid count={4} />
          ) : emergencies.length === 0 ? (
            <EmptyState
              icon={Siren}
              title="No active emergencies"
              description="Great news! There are no emergency requests right now. Check back soon or post one if you need help."
              action={
                <Button variant="danger" onClick={() => setModalOpen(true)}>
                  <Plus size={16} /> Post Emergency
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {emergencies.map((em, i) => (
                <motion.div
                  key={em._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-danger/20 bg-white shadow-soft"
                >
                  <div className="flex items-center justify-between bg-danger px-5 py-2.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white">
                      <Siren size={13} className="animate-pulse" />
                      Emergency
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                      <Clock size={12} />
                      {expiresIn(em.expiresAt)}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-danger text-white">
                        <span className="font-display text-lg font-bold leading-none">
                          {em.bloodGroup}
                        </span>
                        <span className="mt-1 text-[10px] uppercase opacity-80">
                          Urgent
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-xl font-bold text-ink">
                          {em.patientName}
                        </h3>
                        <p className="mt-0.5 text-sm text-ink-soft">
                          {em.units} unit{em.units > 1 ? "s" : ""} needed
                        </p>
                        <div className="mt-2 space-y-1.5 text-sm text-ink-soft">
                          <p className="flex items-center gap-2">
                            <Building2 size={14} className="shrink-0" />
                            <span className="truncate">{em.hospitalName}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin size={14} className="shrink-0" />
                            <span className="truncate">
                              {em.location}
                              {em.city ? `, ${em.city}` : ""}
                              {em.state ? `, ${em.state}` : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {em.reason && (
                      <p className="mt-4 rounded-xl bg-surface/70 px-4 py-3 text-sm text-ink-soft">
                        {em.reason}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <div>
                        <p className="text-xs text-ink-soft">Contact</p>
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                          <PhoneCall size={14} />
                          {em.contactPhone}
                        </p>
                      </div>
                      <a
                        href={`tel:${em.contactPhone}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                      >
                        <Phone size={15} />
                        Call Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Emergency Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Post Emergency Request" size="lg">
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Note:</strong> This is for genuine medical emergencies only.
          Matching verified donors will be notified immediately.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Patient Name"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Patient's full name"
            />
            <Select
              label="Blood Group *"
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              error={formErrors.bloodGroup}
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </Select>
            <Input
              label="Units Needed"
              name="units"
              type="number"
              min="1"
              value={form.units}
              onChange={handleChange}
            />
            <Input
              label="Hospital Name *"
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              error={formErrors.hospitalName}
              placeholder="Hospital / Blood bank"
            />
            <Input
              label="Hospital Location *"
              name="location"
              value={form.location}
              onChange={handleChange}
              error={formErrors.location}
              placeholder="Locality, area"
            />
            <Input
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
            />
            <Select
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
            <Input
              label="Contact Phone *"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              error={formErrors.contactPhone}
              placeholder="Contact number"
            />
          </div>

          <Textarea
            label="Details / Reason"
            name="reason"
            rows={3}
            value={form.reason}
            onChange={handleChange}
            placeholder="Additional emergency details..."
          />

          <div className="flex gap-3 pt-2">
            <Button variant="light" type="button" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Posting..." : "Post Emergency"}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default EmergencyBoard;


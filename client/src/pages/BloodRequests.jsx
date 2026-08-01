import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Droplet, Siren } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import RequestCard from "../components/RequestCard";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { SkeletonGrid } from "../components/ui/Skeleton";
import API from "../api";
import { BLOOD_GROUPS } from "../constants";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  patientName: "",
  bloodGroup: "",
  units: 1,
  hospitalName: "",
  location: "",
  state: "",
  district: "",
  city: "",
  contactName: "",
  contactPhone: "",
  urgency: "normal",
  reason: "",
};

function BloodRequests() {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState({ requests: [], total: 0, page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ bloodGroup: "", status: "", urgency: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.bloodGroup) params.set("bloodGroup", filters.bloodGroup);
      if (filters.status) params.set("status", filters.status);
      if (filters.urgency) params.set("urgency", filters.urgency);
      params.set("page", page);
      params.set("limit", 9);
      const res = await API.get(`/requests?${params.toString()}`);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.patientName.trim()) errs.patientName = "Patient name is required";
    if (!form.bloodGroup) errs.bloodGroup = "Blood group is required";
    if (!form.contactName.trim()) errs.contactName = "Contact name is required";
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
      const res = await API.post("/requests", form);
      toast.success("Blood request created! Matching donors notified.");
      setModalOpen(false);
      setForm(emptyForm);
      setPage(1);
      fetchRequests();
    } catch (err) {
      toast.error(err.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="border-b border-line bg-surface/60 py-14 sm:py-16">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
          >
            <div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                Blood Requests
              </h1>
              <p className="mt-3 max-w-lg text-ink-soft">
                Browse active blood requests and help someone in need. Post your
                own request or respond as a donor.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="danger" to="/emergency-board">
                <Siren size={16} />
                Emergency Board
              </Button>
              <Button
                variant="dark"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("Login to post a request");
                    return;
                  }
                  setModalOpen(true);
                }}
              >
                <Plus size={16} />
                Post Request
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              value={filters.bloodGroup}
              onChange={(e) => {
                setFilters((p) => ({ ...p, bloodGroup: e.target.value }));
                setPage(1);
              }}
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg}>{bg}</option>
              ))}
            </Select>
            <Select
              value={filters.urgency}
              onChange={(e) => {
                setFilters((p) => ({ ...p, urgency: e.target.value }));
                setPage(1);
              }}
            >
              <option value="">All Urgencies</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </Select>
            <Select
              value={filters.status}
              onChange={(e) => {
                setFilters((p) => ({ ...p, status: e.target.value }));
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
        </div>
      </section>

      {/* Requests */}
      <section className="pb-20">
        <div className="container-x">
          {error ? (
            <ErrorState message={error} onRetry={fetchRequests} />
          ) : loading ? (
            <SkeletonGrid count={6} />
          ) : data.requests.length === 0 ? (
            <EmptyState
              icon={Droplet}
              title="No blood requests found"
              description="There are no requests matching your filters. Be the first to post one."
              action={
                <Button variant="dark" onClick={() => setModalOpen(true)}>
                  <Plus size={16} /> Post a Request
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.requests.map((req) => (
                  <RequestCard key={req._id} request={req} />
                ))}
              </div>
              <Pagination page={data.page} pages={data.pages} onPageChange={setPage} />
            </>
          )}
        </div>
      </section>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Post a Blood Request" size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Patient Name *"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              error={formErrors.patientName}
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
            <Select
              label="Urgency"
              name="urgency"
              value={form.urgency}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </Select>

            <Input
              label="Hospital Name"
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              placeholder="Where is the patient?"
            />
            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City / area"
            />

            <Input
              label="Contact Name *"
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              error={formErrors.contactName}
              placeholder={user?.name || "Contact person"}
            />
            <Input
              label="Contact Phone *"
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              error={formErrors.contactPhone}
              placeholder={user?.phone || "Contact number"}
            />
          </div>

          <Textarea
            label="Reason / Additional details"
            name="reason"
            rows={3}
            value={form.reason}
            onChange={handleChange}
            placeholder="Any additional information..."
          />

          <div className="flex gap-3 pt-2">
            <Button variant="light" type="button" onClick={() => setModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="dark" type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Posting..." : "Post Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default BloodRequests;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplet, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import { BLOOD_GROUPS, INDIAN_STATES } from "../constants";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Verified Badge",
    desc: "Get verified and build trust with those in need.",
  },
  {
    icon: HeartHandshake,
    title: "Reward Points",
    desc: "Earn points for every donation. Climb the leaderboard.",
  },
  {
    icon: CheckCircle2,
    title: "Achievement Badges",
    desc: "Unlock badges as you reach donation milestones.",
  },
];

function BecomeDonor() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: user?.bloodGroup || "",
    age: "",
    gender: "",
    state: user?.state || "",
    district: user?.district || "",
    city: user?.city || "",
    address: "",
    phone: user?.phone || "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (form.phone.length < 10)
      newErrors.phone = "Enter a valid phone number";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/become-donor", form);
      toast.success(res.data.message || "Donor registration submitted!");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      toast.error(err.message || "Failed to register as donor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="border-b border-line bg-surface/60 py-14 sm:py-16">
        <div className="container-x text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Become a Donor
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Register as a donor and become a hero in someone's life. It takes
              just a few minutes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink text-white">
                  <b.icon size={20} />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-ink">{b.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-20">
        <div className="container-x max-w-3xl">
          {!isAuthenticated && (
            <div className="mb-6 rounded-2xl border border-line bg-white p-5 text-center shadow-soft">
              <p className="text-sm text-ink-soft">
                You need an account to become a donor.{" "}
                <Link to="/register" className="font-semibold text-ink underline underline-offset-4">
                  Create an account
                </Link>{" "}
                or{" "}
                <Link to="/login" className="font-semibold text-ink underline underline-offset-4">
                  login
                </Link>
                .
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-10"
            >
              <div className="mb-8 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                  <Droplet size={22} />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">
                    Donor Details
                  </h2>
                  <p className="text-sm text-ink-soft">
                    Fill in your details to create your donor profile
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Select
                  label="Blood Group *"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  error={errors.bloodGroup}
                >
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Age"
                  name="age"
                  type="number"
                  min="18"
                  max="65"
                  placeholder="18-65"
                  value={form.age}
                  onChange={handleChange}
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>

                <Input
                  label="Phone *"
                  name="phone"
                  placeholder="10 digit mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />

                <Select
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>

                <Input
                  label="District"
                  name="district"
                  placeholder="Your district"
                  value={form.district}
                  onChange={handleChange}
                />

                <Input
                  label="City *"
                  name="city"
                  placeholder="Your city"
                  value={form.city}
                  onChange={handleChange}
                  error={errors.city}
                />

                <Input
                  label="Address"
                  name="address"
                  placeholder="Street address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-5">
                <Textarea
                  label="Short description (optional)"
                  name="description"
                  placeholder="Anything you'd like others to know..."
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-ink-soft">
                  Your profile will be reviewed by admins before going live.
                </p>
                <Button
                  type="submit"
                  variant="dark"
                  size="lg"
                  disabled={loading}
                  className="sm:min-w-[220px]"
                >
                  {loading ? "Submitting..." : (
                    <>
                      <Droplet size={18} />
                      Become a Donor
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export default BecomeDonor;


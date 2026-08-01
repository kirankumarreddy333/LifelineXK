import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Droplet, Eye, EyeOff } from "lucide-react";

import Layout from "../components/Layout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (form.phone && form.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Enter a valid phone number";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const res = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
    setLoading(false);
    if (res.success) {
      navigate("/become-donor");
    }
  };

  return (
    <Layout>
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-surface/60 py-16">
        <div className="container-x max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="mb-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white shadow-soft">
                <Droplet size={26} />
              </span>
              <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Join LifelineXK and start making a difference
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Phone (optional)"
                    name="phone"
                    placeholder="10 digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />
                </div>

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-[42px] text-neutral-400 transition-colors hover:text-ink"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>

              <Button
                type="submit"
                variant="dark"
                size="lg"
                fullWidth
                disabled={loading}
                className="mt-6"
              >
                {loading ? "Creating account..." : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}
              </Button>

              <p className="mt-5 text-center text-sm text-ink-soft">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-ink underline underline-offset-4"
                >
                  Login
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export default Register;


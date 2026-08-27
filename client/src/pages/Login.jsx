import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplet, LogIn, Eye, EyeOff } from "lucide-react";

import Layout from "../components/Layout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) {
      navigate("/dashboard");
    }
  };

  return (
    <Layout>
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-surface/60 py-16">
        <div className="container-x max-w-md">
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
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Login to LifelineXK to continue saving lives
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"
            >
              <div className="space-y-5">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Your password"
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
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <Link
                  to="/register"
                  className="font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  New here? Create account
                </Link>
              </div>

              <Button
                type="submit"
                variant="dark"
                size="lg"
                fullWidth
                disabled={loading}
                className="mt-6"
              >
                {loading ? "Logging in..." : (
                  <>
                    <LogIn size={18} />
                    Login
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

export default Login;


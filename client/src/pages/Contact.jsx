import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import Layout from "../components/Layout";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SectionHeading from "../components/ui/SectionHeading";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@lifelinexk.com",
    href: "mailto:hello@lifelinexk.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "Bengaluru, Karnataka, India",
  },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSending(true);
    // Demo: simulate send
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
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
              Get in Touch
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-ink-soft">
              Questions, partnerships, or feedback? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          {/* Info */}
          <div className="space-y-6 lg:col-span-2">
            <SectionHeading
              eyebrow="Contact Info"
              title="Let's talk"
              description="Reach out to us through any of these channels and we'll respond as soon as possible."
              align="left"
            />

            <div className="space-y-4">
              {contactInfo.map((c, i) => (
                <Card hover key={i} className="flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-ink">
                    <c.icon size={20} />
                  </span>
                  <div>
                    <p className="text-xs text-ink-soft">{c.label}</p>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="text-sm font-semibold text-ink hover:underline"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-ink">{c.value}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="rounded-2xl bg-ink p-6 text-white">
              <p className="flex items-center gap-2 font-display text-lg font-bold">
                <MessageSquare size={20} />
                Emergency?
              </p>
              <p className="mt-2 text-sm text-white/70">
                For urgent blood requirements, post on the Emergency Board —
                verified donors are notified instantly.
              </p>
              <Button variant="danger" size="sm" to="/emergency-board" className="mt-4">
                Emergency Board
              </Button>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-10"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="Your Name *"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  label="Your Email *"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Textarea
                    label="Message *"
                    name="message"
                    rows={6}
                    placeholder="Write your message here..."
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="dark"
                size="lg"
                className="mt-6"
                disabled={sending}
                fullWidth
              >
                {sending ? "Sending..." : (
                  <>
                    <Send size={16} />
                    Send Message
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

export default Contact;


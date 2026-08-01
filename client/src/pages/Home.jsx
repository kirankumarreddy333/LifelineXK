import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  Droplet,
  MapPin,
  Phone,
  BadgeCheck,
  ArrowRight,
  AlertTriangle,
  HeartPulse,
  Users,
  Building2,
  HandHeart,
  Siren,
} from "lucide-react";

import Layout from "../components/Layout";
import BloodDrop from "../components/BloodDrop";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import SectionHeading from "../components/ui/SectionHeading";
import Card from "../components/ui/Card";
import SuccessStories from "../components/SuccessStories";
import FAQ from "../components/FAQ";
import CompatibilityChart from "../components/CompatibilityChart";
import { Reveal, StaggerGroup, StaggerItem } from "../animations";

const stats = [
  { icon: Users, value: "12,000+", label: "Verified Donors" },
  { icon: Building2, value: "450+", label: "Partner Hospitals" },
  { icon: HandHeart, value: "48,000+", label: "Lives Saved" },
  { icon: Siren, value: "3,200+", label: "Blood Requests" },
];

const bloodGroups = [
  { group: "O-", desc: "Universal Donor", pct: "Can donate to all blood groups" },
  { group: "O+", desc: "Most Common", pct: "Donates to O+, A+, B+, AB+" },
  { group: "A+", desc: "Common", pct: "Donates to A+, AB+" },
  { group: "A-", desc: "Rare", pct: "Donates to A+, A-, AB+, AB-" },
  { group: "B+", desc: "Common", pct: "Donates to B+, AB+" },
  { group: "B-", desc: "Rare", pct: "Donates to B+, B-, AB+, AB-" },
  { group: "AB+", desc: "Universal Recipient", pct: "Receives from all groups" },
  { group: "AB-", desc: "Rarest", pct: "Donates to AB+, AB-" },
];

const steps = [
  {
    icon: UserPlus,
    title: "Register & Create Profile",
    desc: "Sign up in under 2 minutes. Add your blood group, location and availability.",
  },
  {
    icon: Search,
    title: "Find or Become a Donor",
    desc: "Search verified donors near you by blood group and location, or register as a donor.",
  },
  {
    icon: Droplet,
    title: "Donate & Save Lives",
    desc: "Connect with people in need, donate blood, and earn reward points & badges.",
  },
];

function Home() {
  return (
    <Layout>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-white">
        {/* subtle background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(#e5e5e5 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container-x relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink-soft shadow-soft">
              <HeartPulse size={14} className="text-danger" />
              Connecting Heroes. Saving Lives.
            </span>

            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Every Donation
              <br />
              Can Save
              <br />
              <span className="text-gradient">A Life.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              Find verified blood donors instantly. LifelineXK connects heroes
              with those in need — fast, secure, and rewarding.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="dark" size="lg" to="/find-donors">
                <Search size={18} />
                Find Donor
              </Button>
              <Button variant="light" size="lg" to="/become-donor">
                <UserPlus size={18} />
                Become Donor
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {["RS", "PK", "AM", "JT"].map((initials, i) => (
                  <span
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-neutral-800 text-xs font-bold text-white"
                    style={{ zIndex: 4 - i }}
                  >
                    {initials}
                  </span>
                ))}
              </div>
              <p className="text-sm text-ink-soft">
                <span className="font-semibold text-ink">12,000+</span> donors
                ready to help
              </p>
            </div>
          </motion.div>

          {/* Right — Animated Blood Drop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <BloodDrop size="lg" />

              {/* Floating info cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-6 top-6 rounded-2xl border border-line bg-white p-4 shadow-lift sm:-left-12"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
                    <BadgeCheck size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">Verified Donor</p>
                    <p className="text-xs text-ink-soft">Identity confirmed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                className="absolute -right-4 bottom-10 rounded-2xl border border-line bg-white p-4 shadow-lift sm:-right-8"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
                    <MapPin size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">2 km away</p>
                    <p className="text-xs text-ink-soft">O+ donor nearby</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                className="absolute -bottom-4 left-8 rounded-2xl border border-line bg-white p-4 shadow-lift"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
                    <Phone size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">Contact Instantly</p>
                    <p className="text-xs text-ink-soft">One tap away</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATISTICS ===== */}
      <section className="border-y border-line bg-surface/60 py-16">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="How It Works"
            title="Saving lives in three simple steps"
            description="From registration to donation, LifelineXK makes the entire process seamless and rewarding."
          />

          <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <Card hover className="relative h-full overflow-hidden p-8">
                  <span className="absolute -right-2 -top-4 font-display text-8xl font-bold text-neutral-50">
                    {i + 1}
                  </span>
                  <div className="relative">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white shadow-soft">
                      <step.icon size={24} strokeWidth={1.8} />
                    </span>
                    <h3 className="mt-6 font-display text-xl font-bold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {step.desc}
                    </p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ===== BLOOD GROUPS ===== */}
      <section className="bg-surface/60 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Blood Groups"
            title="Know your blood group"
            description="Understanding blood group compatibility is the first step to saving lives."
          />

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bloodGroups.map((bg, i) => (
              <Reveal key={bg.group} delay={i * 0.04}>
                <div className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-lg font-bold text-white transition-colors group-hover:bg-danger">
                    {bg.group}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{bg.desc}</p>
                    <p className="mt-0.5 text-xs leading-snug text-ink-soft">{bg.pct}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EMERGENCY BANNER ===== */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-14">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(#fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-danger px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                    <AlertTriangle size={14} />
                    Emergency
                  </span>
                  <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                    Need blood urgently?
                    <br />
                    We're here to help.
                  </h2>
                  <p className="mt-4 max-w-md text-white/70">
                    Post an emergency request and nearby verified donors will be
                    notified immediately. Every minute matters.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button variant="danger" size="lg" to="/emergency-board">
                      <Siren size={18} />
                      Emergency Board
                    </Button>
                    <Button
                      variant="light"
                      size="lg"
                      to="/blood-requests"
                    >
                      View Requests
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </div>
                <div className="hidden justify-end lg:flex">
                  <BloodDrop size="md" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== COMPATIBILITY CHART ===== */}
      <section className="bg-surface/60 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Compatibility"
            title="Blood compatibility chart"
            description="Select a recipient's blood group to see which donor types are compatible."
          />
          <Reveal className="mt-14">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-10">
              <CompatibilityChart />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== SUCCESS STORIES ===== */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Success Stories"
            title="Real heroes. Real impact."
            description="Stories from donors and recipients who found each other through LifelineXK."
          />
          <div className="mt-14">
            <SuccessStories />
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-surface/60 py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Everything you need to know about donating blood and using LifelineXK."
              align="left"
            />
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline"
            >
              Still have questions? Contact us <ArrowRight size={15} />
            </Link>
          </div>
          <div className="lg:col-span-3">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <div className="rounded-3xl border border-line bg-white p-10 text-center shadow-soft sm:p-16">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <Droplet size={30} />
              </span>
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Be the reason someone lives today.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-soft">
                Join thousands of heroes who have made blood donation a part of
                their lives. Your single donation can save up to three lives.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button variant="dark" size="lg" to="/become-donor">
                  <UserPlus size={18} />
                  Become a Donor
                </Button>
                <Button variant="light" size="lg" to="/register">
                  Create Account
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}

export default Home;


import { motion } from "framer-motion";
import {
  HeartPulse,
  Target,
  Eye,
  ShieldCheck,
  Users,
  Globe,
  CreditCard,
  HandHeart,
} from "lucide-react";

import Layout from "../components/Layout";
import SectionHeading from "../components/ui/SectionHeading";
import Card from "../components/ui/Card";
import BloodDrop from "../components/BloodDrop";
import Button from "../components/ui/Button";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To connect every patient in need with a verified blood donor within minutes — eliminating the anxiety of finding compatible blood during emergencies.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    desc: "A world where no one dies waiting for blood. We envision a global, self-sustaining donor network powered by technology and human compassion.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    desc: "Every donor on LifelineXK undergoes verification. We prioritize authenticity and transparency to ensure recipients always have complete confidence.",
  },
];

const stats = [
  { value: "12k+", label: "Verified Donors" },
  { value: "450+", label: "Partner Hospitals" },
  { value: "48k+", label: "Lives Saved" },
  { value: "3.2k+", label: "Blood Requests" },
];

const features = [
  {
    icon: Users,
    title: "Verified Donor Network",
    desc: "Every donor is approved by our team, ensuring trust and reliability for those in critical need.",
  },
  {
    icon: Globe,
    title: "Nationwide Reach",
    desc: "Find donors across every state and district in India, with hospital integration for seamless coordination.",
  },
  {
    icon: CreditCard,
    title: "Reward System",
    desc: "Donors earn points, achievements and leaderboard recognition for their selfless contributions.",
  },
  {
    icon: HandHeart,
    title: "Community Driven",
    desc: "Success stories of thousands of lives saved fuel our mission. We're a community of everyday heroes.",
  },
];

function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface/60 py-20 sm:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-ink-soft shadow-soft">
              <HeartPulse size={14} className="text-danger" />
              About LifelineXK
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              We exist to make
              <br />
              <span className="text-gradient">blood donation</span>
              <br />
              effortless.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              LifelineXK ("XK" for "Xtra Kindness") is a modern blood donor
              management platform built to bridge the gap between donors and
              those in desperate need.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <BloodDrop size="md" />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-white py-12">
        <div className="container-x grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="text-center"
            >
              <p className="font-display text-3xl font-bold text-ink sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why We Exist"
            title="A mission driven by urgency"
            description="Every day, thousands of people need blood. LifelineXK ensures the heroes are always a tap away."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl2 border border-line bg-white p-8 shadow-soft"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
                  <v.icon size={24} strokeWidth={1.8} />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold text-ink">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface/60 py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="What We Offer"
            title="Everything you need. Nothing you don't."
          />
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <Card hover key={i} className="flex items-start gap-5 p-6 sm:p-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-ink">
                  <f.icon size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 rounded-3xl bg-ink p-10 text-center sm:p-14">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to make a difference?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Join thousands of heroes today. Your one donation can save up to
              three lives.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button variant="danger" size="lg" to="/become-donor">
                Become a Donor
              </Button>
              <Button variant="light" size="lg" to="/find-donors">
                Find a Donor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default About;


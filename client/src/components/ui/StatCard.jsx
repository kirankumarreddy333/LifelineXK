import { motion } from "framer-motion";

function StatCard({ icon: Icon, value, label, delay = 0, prefix = "", suffix = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="rounded-xl2 border border-line bg-white p-6 shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-surface">
        <Icon size={22} className="text-ink" strokeWidth={1.8} />
      </div>
      <p className="font-display text-3xl font-bold tracking-tight text-ink">
        {prefix}
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </motion.div>
  );
}

export default StatCard;


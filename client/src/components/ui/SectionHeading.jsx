import { motion } from "framer-motion";

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}) {
  const alignment =
    align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`max-w-2xl ${alignment}`}
    >
      {eyebrow && (
        <span
          className={`mb-3 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${
            dark ? "bg-white/10 text-white" : "bg-surface text-ink-soft"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-white/70" : "text-ink-soft"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeading;


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Who can donate blood?",
    a: "Generally, healthy adults aged 18-60 who weigh at least 50kg can donate blood. You should be free of infections, not on certain medications, and have hemoglobin levels above the minimum threshold. Always consult with medical staff before donating.",
  },
  {
    q: "How often can I donate blood?",
    a: "For whole blood donation, the recommended interval is every 90 days (about 3 months). Men can typically donate up to 4 times a year, and women up to 3 times a year.",
  },
  {
    q: "Is donating blood safe?",
    a: "Absolutely. All equipment used is sterile and single-use. You'll be supervised by trained medical professionals throughout the process. The average adult has 5-6 liters of blood, and you only donate about 350-450ml.",
  },
  {
    q: "How long does a blood donation take?",
    a: "The entire process takes about 45-60 minutes, including registration, a quick health screening, the actual donation (which takes about 8-10 minutes), and a short rest afterwards.",
  },
  {
    q: "What should I do after donating blood?",
    a: "Rest for 15 minutes, drink plenty of fluids, eat a light snack, and avoid heavy exercise or alcohol for the rest of the day. Your body will replenish the donated blood within a few weeks.",
  },
  {
    q: "What are the benefits of donating blood?",
    a: "Beyond saving up to 3 lives per donation, donating blood can help improve cardiovascular health, reduce iron levels (which may benefit some people), and you'll earn LifelineXK reward points and achievement badges.",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-base font-semibold text-ink sm:text-lg">
          {faq.q}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface text-ink transition-transform duration-300">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-ink-soft sm:text-base">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQ() {
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <FAQItem key={i} faq={faq} index={i} />
      ))}
    </div>
  );
}

export default FAQ;


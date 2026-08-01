import { motion } from "framer-motion";
import { fadeInUp } from "../../animations";

function Card({ children, className = "", hover = false, delay = 0 }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={`bg-card border border-line rounded-xl2 shadow-soft ${
        hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lift" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;


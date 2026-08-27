import { motion } from "framer-motion";

function BloodDrop({ className = "", size = "lg" }) {
  const dims =
    size === "lg"
      ? { w: 200, h: 220 }
      : size === "md"
      ? { w: 120, h: 132 }
      : { w: 64, h: 70 };

  return (
    <motion.div
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <svg
        width={dims.w}
        height={dims.h}
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft background blob */}
        <motion.circle
          cx="100"
          cy="110"
          r="88"
          fill="#f5f5f5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {/* Drop shadow */}
        <motion.ellipse
          cx="100"
          cy="196"
          rx="42"
          ry="10"
          fill="#111"
          opacity="0.08"
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        {/* Blood drop */}
        <path
          d="M100 24C100 24 52 104 52 148a48 48 0 0 0 96 0c0-44-48-124-48-124z"
          fill="#111111"
        />
        {/* Highlight */}
        <path
          d="M76 132a20 20 0 0 0 12 18"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.25"
          fill="none"
        />
        {/* Pulse ring */}
        <motion.circle
          cx="100"
          cy="150"
          r="48"
          stroke="#111111"
          strokeWidth="2"
          fill="none"
          opacity="0.2"
          animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

export default BloodDrop;


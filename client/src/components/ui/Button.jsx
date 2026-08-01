import { Link } from "react-router-dom";

const variants = {
  primary:
    "bg-ink text-white hover:bg-ink/80 shadow-soft hover:shadow-lift focus-visible:outline-ink",
  dark: "bg-black text-white hover:bg-neutral-800 shadow-soft",
  light:
    "bg-white text-ink border border-line hover:border-neutral-300 hover:bg-surface shadow-soft",
  ghost: "bg-transparent text-ink hover:bg-surface",
  danger: "bg-danger text-white hover:bg-red-700 shadow-soft",
  success: "bg-success text-white hover:bg-green-700 shadow-soft",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl",
  md: "px-6 py-3 text-sm rounded-xl",
  lg: "px-8 py-4 text-base rounded-2xl",
  icon: "p-2.5 rounded-xl",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  className = "",
  fullWidth = false,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;


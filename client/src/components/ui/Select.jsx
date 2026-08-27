function Select({ label, error, className = "", id, children, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-ink"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm text-ink transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-danger focus:ring-danger/20"
            : "border-line hover:border-neutral-300 focus:border-ink focus:ring-ink/10"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default Select;


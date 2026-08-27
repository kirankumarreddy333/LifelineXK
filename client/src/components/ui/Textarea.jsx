function Textarea({ label, error, className = "", id, ...props }) {
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
      <textarea
        id={id}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-danger focus:ring-danger/20"
            : "border-line hover:border-neutral-300 focus:border-ink focus:ring-ink/10"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default Textarea;


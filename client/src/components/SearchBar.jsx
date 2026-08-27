import { Search } from "lucide-react";

function SearchBar({
  value,
  onChange,
  placeholder = "Search donors, blood group, city...",
  size = "lg",
  className = "",
}) {
  const sizeCls =
    size === "lg" ? "py-4 pl-12 pr-4 text-base rounded-2xl" : "py-3 pl-11 pr-3 text-sm rounded-xl";

  return (
    <div className={`relative ${className}`}>
      <Search
        size={size === "lg" ? 20 : 18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-line bg-white text-ink placeholder:text-neutral-400 shadow-soft transition-all focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink ${sizeCls}`}
      />
    </div>
  );
}

export default SearchBar;


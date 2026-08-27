import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, pages, onPageChange, siblingCount = 1 }) {
  if (pages <= 1) return null;

  const getPageItems = () => {
    const items = [];
    const start = Math.max(2, page - siblingCount);
    const end = Math.min(pages - 1, page + siblingCount);

    items.push(1);
    if (start > 2) items.push("...");
    for (let i = start; i <= end; i++) items.push(i);
    if (end < pages - 1) items.push("...");
    if (pages > 1) items.push(pages);

    return items;
  };

  const base =
    "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors";

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`${base} border border-line bg-white text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronLeft size={18} />
      </button>

      {getPageItems().map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} className="px-1 text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`${base} ${
              item === page
                ? "bg-ink text-white shadow-soft"
                : "border border-line bg-white text-ink hover:bg-surface"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className={`${base} border border-line bg-white text-ink hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default Pagination;


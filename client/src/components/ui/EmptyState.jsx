import { SearchX } from "lucide-react";

function EmptyState({
  icon: Icon = SearchX,
  title = "Nothing here yet",
  description = "No items found. Try adjusting your filters or check back later.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line bg-surface/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft">
        <Icon size={28} className="text-neutral-400" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;


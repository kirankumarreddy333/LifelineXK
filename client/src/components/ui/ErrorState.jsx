import { AlertTriangle } from "lucide-react";
import Button from "./Button";

function ErrorState({
  message = "Something went wrong while loading this page.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-line bg-surface/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft">
        <AlertTriangle size={28} className="text-danger" />
      </div>
      <h3 className="text-lg font-semibold text-ink">Error</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <Button variant="light" size="sm" className="mt-5" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;


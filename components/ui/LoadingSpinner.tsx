type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-5 w-5 border",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export default function LoadingSpinner({
  label = "Loading",
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={`${sizeClass[size]} animate-spin rounded-full border-blue-600 border-t-transparent`}
      />
      {label ? (
        <span className="text-sm text-gray-500 sr-only">{label}</span>
      ) : null}
    </div>
  );
}

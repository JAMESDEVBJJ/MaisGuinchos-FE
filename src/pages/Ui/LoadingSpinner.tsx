type LoadingSpinnerProps = {
  size?: number;
  padding?: number | string;
};

export function LoadingSpinner({
  size = 50,
  padding = 30,
}: LoadingSpinnerProps) {
  return (
    <div
      className="loading-container"
      style={{ padding }}
    >
      <svg
        className="loading-spinner"
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#E67539"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="90 40"
        />
      </svg>
    </div>
  );
}
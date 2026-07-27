export function LoadingSpinner() {
    return (
      <div className="loading-container">
        <svg
          className="loading-spinner"
          width="50"
          height="50"
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
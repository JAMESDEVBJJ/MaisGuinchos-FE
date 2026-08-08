type LongArrowProps = {
    className?: string;
};

export function LongArrow({ className = "" }: LongArrowProps) {
    return (
        <svg
            className={`long-arrow ${className}`}
            width="32"
            height="16"
            viewBox="0 0 32 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <line x1="1" y1="8" x2="26" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M20 2L27 8L20 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    );
}
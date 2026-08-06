
type TowTruckIconProps = {
  size?: number;
};

export default function TowTruckIcon({ size = 22 }: TowTruckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Guincho"
    >
      {/* Cabine */}
      <path
        d="M8 47V25C8 21.7 10.7 19 14 19H35L43 31V47H8Z"
        fill="currentColor"
      />

      {/* Janela da cabine */}
      <path d="M16 23H32L37 31H16V23Z" fill="#101b2a" />

      {/* Detalhe da porta */}
      <rect x="30" y="35" width="5" height="2" rx="1" fill="#101b2a" />

      {/* Plataforma */}
      <rect x="42" y="32" width="48" height="15" rx="3" fill="currentColor" />

      {/* Lança do guincho */}
      <path
        d="M45 31L76 7C78 5.5 80 7.5 78.5 9.5L61 31H45Z"
        fill="currentColor"
      />

      {/* Cabo */}
      <path
        d="M78 8V25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Gancho */}
      <path
        d="M78 25C78 28 82 28 82 25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Rodas */}
      <circle
        cx="24"
        cy="49"
        r="8"
        fill="#101b2a"
        stroke="currentColor"
        strokeWidth="3"
      />

      <circle
        cx="76"
        cy="49"
        r="8"
        fill="#101b2a"
        stroke="currentColor"
        strokeWidth="3"
      />

      {/* Cubo das rodas */}
      <circle cx="24" cy="49" r="2.5" fill="currentColor" />

      <circle cx="76" cy="49" r="2.5" fill="currentColor" />
    </svg>
  );
}

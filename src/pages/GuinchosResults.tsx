import type { GuinchosDto } from "../dtos/MapPropsDTO";

type guinchosResultsProps = {
  guinchos: GuinchosDto[];
};

export default function GuinchosResults({ guinchos }: guinchosResultsProps) {
  if (guinchos.length <= 0) {
    return null;
  }

  return (
    <div className="results">
      {guinchos.map((m) => (
        <div className="result-card">
          <span>TRUCK  </span>
          <span>{m.distanceKm.toFixed(1)}Km</span>
        </div>
      ))}
    </div>
  );
}

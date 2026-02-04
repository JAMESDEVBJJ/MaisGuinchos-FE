import type { GuinchosDto } from "../dtos/MapPropsDTO";

type guinchosResultsProps = {
  guinchos: GuinchosDto[];
  isCompact: Boolean;
};

export default function GuinchosResults({
  isCompact,
  guinchos,
}: guinchosResultsProps) {
  if (guinchos.length <= 0) {
    return null;
  }

  return (
    <div className="results">
      {guinchos.map((m) => (
        <div className="result-card">
          <div className="card-main">
            <div className="left">
              {!isCompact && <span className="title">TRUCK</span>}
              <span className="distance">{m.distanceKm.toFixed(1)} km</span>
            </div>

            <div
              className={`status ${m.available ? "available" : "unavailable"}`}
            >
              <span className="dot" />
              {!isCompact && (
                <span className="status-text">
                  {m.available ? "Disponível" : "Indisponível"}
                </span>
              )}
            </div>
          </div>

          <div className="card-extra">
            <span className="title">⭐ {m.stars}</span>
            <span className="title">{m.motorista.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

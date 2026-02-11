import type { GuinchosDto } from "../dtos/MapPropsDTO";

type GuinchosResultsProps = {
  guinchos: GuinchosDto[];
  isCompact: boolean;
  setHovered: (userid: number | null) => void;
  mapRef: React.RefObject<L.Map | null>;
};

export default function GuinchosResults({
  isCompact,
  guinchos,
  setHovered,
  mapRef,
}: GuinchosResultsProps) {
  if (guinchos.length <= 0) {
    return null;
  }

  return (
    <div className="results">
      {guinchos.map((g) => (
        <div
          className="result-card"
          onMouseEnter={() => setHovered(g.motorista.userId)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            if (
              g.motorista.lat != null &&
              g.motorista.lon != null &&
              mapRef.current
            ) {
              mapRef.current.flyTo(
                [g.motorista.lat, g.motorista.lon],
                mapRef.current.getZoom(),
                { animate: true }
              );
            }
          }}
        >
          <div className="card-main">
            <div className="left">
              {!isCompact && <span className="title">{g.model}</span>}
              <span className="distance">{g.distanceKm.toFixed(1)} km</span>
            </div>

            <div
              className={`status ${g.available ? "available" : "unavailable"}`}
            >
              <span className="dot" />
              {!isCompact && (
                <span className="status-text">
                  {g.available ? "Disponível" : "Indisponível"}
                </span>
              )}
            </div>
          </div>

          <div className="card-extra">
            <span className="title">⭐ {g.stars}</span>
            <span className="title">{g.motorista.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

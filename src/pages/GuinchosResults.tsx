import type { GuinchosDto } from "../dtos/MapPropsDTO";

type GuinchosResultsProps = {
  guinchos: GuinchosDto[];
  isCompact: boolean;
  setHovered: (userid: string | null) => void;
  mapRef: React.RefObject<L.Map | null>;
  setSelectedGuincho: (g: GuinchosDto | null) => void;
};

export default function GuinchosResults({
  isCompact,
  guinchos,
  setHovered,
  mapRef,
  setSelectedGuincho
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
            setSelectedGuincho(g);
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

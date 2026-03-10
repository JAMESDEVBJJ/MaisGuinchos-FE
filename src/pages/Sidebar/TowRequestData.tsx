import { useState } from 'react';
type TowRequestDataProps = {
  distanceKm: number;
  durationMin: number;
  priceEstimate: number;

  distanceKmG: number;
  durationMinG: number;
  priceEstimateG: number;

  routeG?: any;
};

export function TowRequestData({
  distanceKm,
  durationMin,
  priceEstimate,
  distanceKmG,
  durationMinG,
  priceEstimateG,
  routeG,
}: TowRequestDataProps) {
  const [showDetails, setShowDetails] = useState(false);

  //if (!routeG) return null;

  const totalDistance = distanceKm + distanceKmG;
  const totalDuration = durationMin + durationMinG;
  const totalPrice = priceEstimate + priceEstimateG;

  return (
    <div className="route-summary">
      <ul className="tow-info">
        <li>
          <strong>Distância total:</strong> {totalDistance.toFixed(1)} Km
        </li>

        <li>
          <strong>Tempo médio:</strong> {(totalDuration / 60).toFixed(1)} h
        </li>

        {!showDetails && (
          <li>
            <strong>Preço estimado:</strong> {totalPrice.toFixed(0)} R$
          </li>
        )}
      </ul>

      {showDetails && (
        <div className="route-breakdown">
          <p>
            <strong>
              Guincho
              <span className="arrow yellow"> → </span>
              Você
            </strong>{" "}
            {priceEstimateG.toFixed(0)} R$ {distanceKmG.toFixed(0)} km
          </p>

          <p>
            <strong>
              Você
              <span className="arrow orange"> → </span>
              Destino
            </strong>{" "}
            {priceEstimate.toFixed(0)} R$ {distanceKm.toFixed(0)} km
          </p>
        </div>
      )}

      <span
        className="more-details"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Menos detalhes" : "Mais detalhes"}
      </span>
    </div>
  );
}

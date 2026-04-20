import { useState } from "react";
import { useTowTravel } from "../../contexts/TowTravelContext";
type TowRequestDataProps = {
  distanceKm: number;
  durationMin: number;
  priceEstimate: number;

  distanceKmG: number;
  durationMinG: number;
  priceEstimateG: number;

  routeG?: any;

  modelo: string | null;

  totalDistanceKm: number | null;
  suggestedPrice: number | null;
};

export function TowRequestData({
  distanceKm,
  durationMin,
  priceEstimate,
  distanceKmG,
  durationMinG,
  priceEstimateG,
  routeG,
  modelo,
  totalDistanceKm,
  suggestedPrice,
}: TowRequestDataProps) {
  const [showDetails, setShowDetails] = useState(false);

  //if (!routeG) return null;

  const totalDistance = distanceKm + distanceKmG;
  const totalDuration = durationMin + durationMinG;
  const totalPrice = priceEstimate + priceEstimateG;

  const {towTravel, towTravelStatus, remainingTime, remainingDistance} = useTowTravel();

  return (
    <div className="route-summary">
      <ul className="tow-info">
        {!towTravel ? (
          <>
            <li>
              <strong>Distância total:</strong>{" "}
              {totalDistanceKm
                ? totalDistanceKm.toFixed(1)
                : totalDistance.toFixed(1)}{" "}
              Km
            </li>

            <li>
              <strong>Tempo médio:</strong> {(totalDuration / 60).toFixed(1)} h
            </li>
          </>
        ) : (
          <>
            <li>
              <strong>Distância restante: </strong>{" "}
              {remainingDistance
                ? remainingDistance.toFixed(1) : "sem distancia faltante"}{" "}
              Km
            </li>

            <li>
              <strong>Tempo médio restante: </strong> {remainingTime ? (remainingTime / 60).toFixed(1) : "tbm"} h
            </li>
          </>
        )}

        {!showDetails && (
          <li>
            <strong>Preço estimado:</strong>{" "}
            {suggestedPrice ? suggestedPrice.toFixed(0) : totalPrice.toFixed(0)}{" "}
            R$
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

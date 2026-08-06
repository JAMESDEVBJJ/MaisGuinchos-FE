import { useState } from "react";
import { useTowTravel } from "../../contexts/TowTravelContext";
import { useAuth } from "../../contexts/AuthContext";
import { TowTravelStatus } from "../../utils/enums/TowTravelStatus";
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
  //modelo, //trazer e mostra
  totalDistanceKm,
  suggestedPrice,
}: TowRequestDataProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { user } = useAuth();

  const totalDistance = distanceKm + distanceKmG;
  const totalDuration = durationMin + durationMinG;
  const totalPrice = priceEstimate + priceEstimateG;

  const { towTravel } = useTowTravel();

  const totalTimeTravel = towTravel
    ? towTravel?.timeToDestinationMin + towTravel?.timeToPickupMin
    : 0;
  const totalDistanceTravel = towTravel
    ? towTravel?.distanceToDestinationKm + towTravel?.distanceToPickupKm
    : 0;

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
        ) : towTravel.status === TowTravelStatus.Finished ? (
          <>
            <strong>Serviço finalizado.</strong>
            <strong>
              Valor do serviço: {towTravel.finalPrice.toFixed(0)} R$
            </strong>
          </>
        ) : towTravel.status === TowTravelStatus.ArrivedAtDestination &&
          user?.isClient ? (
          <>
            <strong>Trajeto finalizado, aguardando término do reboque.</strong>
            <strong>
              Valor do serviço: {towTravel.finalPrice.toFixed(0)} R$
            </strong>
          </>
        ) : towTravel.status === TowTravelStatus.ArrivedAtDestination &&
          user?.isDriver ? (
          <>
            <strong>Você chegou ao destino.</strong>
            <strong>
              Valor do serviço: {towTravel.finalPrice.toFixed(0)} R$
            </strong>
          </>
        ) : (
          <>
            <li>
              <strong>Distância restante: </strong>{" "}
              {totalDistanceTravel
                ? totalDistanceTravel.toFixed(1)
                : "não recebida"}{" "}
              Km
            </li>

            <li>
              <strong>Tempo restante estimado: </strong>{" "}
              {totalTimeTravel
                ? (totalTimeTravel / 60).toFixed(1)
                : "não recebido"}{" "}
              h
            </li>
          </>
        )}

        {towTravel &&
          towTravel.status !== TowTravelStatus.Finished &&
          towTravel.status !== TowTravelStatus.ArrivedAtDestination && (
            <li>
              <strong>Preço:</strong> {towTravel.finalPrice.toFixed(0)} R$
            </li>
          )}

        {!showDetails && !towTravel && (
          <li>
            <strong>Preço estimado:</strong>{" "}
            {suggestedPrice ? suggestedPrice.toFixed(0) : totalPrice.toFixed(0)}{" "}
            R$
          </li>
        )}
      </ul>

      {showDetails && user?.isClient && !towTravel && (
        <div className="route-breakdown">
          {" "}
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
      {user?.isClient && !towTravel && (
        <span
          className="more-details"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Menos detalhes" : "Mais detalhes"}
        </span>
      )}
    </div>
  );
}

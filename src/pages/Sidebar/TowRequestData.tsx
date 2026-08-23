import { useState } from "react";
import { useTowTravel } from "../../contexts/TowTravelContext";
import { useAuth } from "../../contexts/AuthContext";
import { TowTravelStatus } from "../../utils/enums/TowTravelStatus";
import { LongArrow } from "../Ui/LongArrow";
import { Route, Clock, CircleDollarSign } from "lucide-react";
import "../../styles/TowRequestData.css";

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

  // Título dinâmico conforme o status
  const isFinished = towTravel?.status === TowTravelStatus.Finished;
  const isArrivedClient =
    towTravel?.status === TowTravelStatus.ArrivedAtDestination &&
    user?.isClient;
  const isArrivedDriver =
    towTravel?.status === TowTravelStatus.ArrivedAtDestination &&
    user?.isDriver;
  const isMessageState = isFinished || isArrivedClient || isArrivedDriver;

  const summaryTitle = isFinished
    ? "SERVIÇO FINALIZADO"
    : isMessageState
    ? "STATUS DA CORRIDA"
    : "RESUMO DA CORRIDA";

  return (
    <div className="route-summary">
      <div className="summary-header">{summaryTitle}</div>

      {!towTravel ? (
        // Estado inicial: 3 colunas (Distância / Tempo / Preço estimado)
        <div className="summary-grid">
          <div className="summary-item">
            <Route className="summary-icon" size={22} strokeWidth={1.75} />
            <span className="summary-label">Distância:</span>
            <span className="summary-value">
              {totalDistanceKm
                ? totalDistanceKm.toFixed(1)
                : totalDistance.toFixed(1)}{" "}
              Km
            </span>
          </div>

          <div className="summary-item">
            <Clock className="summary-icon" size={22} strokeWidth={1.75} />
            <span className="summary-label">Tempo Est.:</span>
            <span className="summary-value">
              {(totalDuration / 60).toFixed(1)} h
            </span>
          </div>

          {!showDetails && (
            <div className="summary-item">
              <CircleDollarSign
                className="summary-icon"
                size={22}
                strokeWidth={1.75}
              />
              <span className="summary-label">Custo:</span>
              <span className="summary-value">
                R${" "}
                {suggestedPrice
                  ? suggestedPrice.toFixed(0)
                  : totalPrice.toFixed(0)}
              </span>
            </div>
          )}
        </div>
      ) : isMessageState ? (
        // Estados de mensagem: caixa centralizada com valor final em destaque
        <div className="summary-message">
          <p className="summary-message-text">
            {isFinished
              ? "Serviço finalizado."
              : isArrivedClient
              ? "Trajeto finalizado, aguardando término do reboque."
              : "Você chegou ao destino."}
          </p>
          <div className="summary-item summary-item--wide">
            <CircleDollarSign
              className="summary-icon"
              size={22}
              strokeWidth={1.75}
            />
            <span className="summary-label">Valor do serviço:</span>
            <span className="summary-value">
              R$ {towTravel.finalPrice.toFixed(0)}
            </span>
          </div>
        </div>
      ) : (
        // Em andamento: 3 colunas (Distância restante / Tempo restante / Preço)
        <div className="summary-grid">
          <div className="summary-item">
            <Route className="summary-icon" size={22} strokeWidth={1.75} />
            <span className="summary-label">Distância rest.:</span>
            <span className="summary-value">
              {totalDistanceTravel
                ? `${totalDistanceTravel.toFixed(1)} Km`
                : "não recebida"}
            </span>
          </div>

          <div className="summary-item">
            <Clock className="summary-icon" size={22} strokeWidth={1.75} />
            <span className="summary-label">Tempo rest.:</span>
            <span className="summary-value">
              {totalTimeTravel
                ? `${(totalTimeTravel / 60).toFixed(1)} h`
                : "não recebido"}
            </span>
          </div>

          <div className="summary-item">
            <CircleDollarSign
              className="summary-icon"
              size={22}
              strokeWidth={1.75}
            />
            <span className="summary-label">Preço:</span>
            <span className="summary-value">
              R$ {towTravel.finalPrice.toFixed(0)}
            </span>
          </div>
        </div>
      )}

      {showDetails && user?.isClient && !towTravel && (
        <div className="route-breakdown">
          <p>
            <strong>
              Guincho
              <LongArrow className="arrow-yellow" />
              Você
            </strong>{" "}
            {priceEstimateG.toFixed(0)} R$ {distanceKmG.toFixed(0)} km
          </p>
          <p>
            <strong>
              Você
              <LongArrow className="arrow-orange" />
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

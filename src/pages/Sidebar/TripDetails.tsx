import { useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { LongArrow } from "../Ui/LongArrow";
import "../../styles/TripDetails.css";

interface RouteLeg {
  distanceKm: number;
  priceEstimate: number;
}

interface TripDetailsProps {
  distanceKm?: number;
  durationHours: number;
  priceEstimate?: number;

  driverRoute?: RouteLeg;
  userRoute?: RouteLeg;

  showBreakdown?: boolean;
}

export default function TripDetails({
  distanceKm,
  durationHours,
  priceEstimate,
  driverRoute,
  userRoute,
  showBreakdown = false,
}: TripDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  const totalDistanceKm =
    distanceKm ??
    (driverRoute && userRoute
      ? driverRoute.distanceKm + userRoute.distanceKm
      : 0);

  const totalPrice =
    priceEstimate ??
    (driverRoute && userRoute
      ? driverRoute.priceEstimate + userRoute.priceEstimate
      : 0);

  const canShowBreakdown = showBreakdown && driverRoute && userRoute;

  return (
    <div className="trip-details">
      <ul className="trip-details__list">
        <li className="trip-details__item">
          <MapPin size={16} className="trip-details__icon" />
          <span className="trip-details__text">
            <span className="trip-details__label">Distância total:</span>{" "}
            <span className="trip-details__value">
              {totalDistanceKm.toFixed(1)} Km
            </span>
          </span>
        </li>

        <li className="trip-details__item">
          <Clock size={16} className="trip-details__icon" />
          <span className="trip-details__text">
            <span className="trip-details__label">Tempo médio:</span>{" "}
            <span className="trip-details__value">
              {durationHours.toFixed(1)} h
            </span>
          </span>
        </li>

        <li className="trip-details__item">
          <DollarSign size={16} className="trip-details__icon" />
          <span className="trip-details__text">
            <span className="trip-details__label">Preço estimado:</span>{" "}
            <span className="trip-details__value trip-details__value--price">
              R$ {totalPrice.toFixed(0)}
            </span>
          </span>
        </li>
      </ul>

      {canShowBreakdown && (
        <>
          <button
            className="trip-details__more"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            <span>{expanded ? "Menos detalhes" : "Mais detalhes"}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <div
            className={`route-breakdown ${
              expanded ? "route-breakdown--open" : ""
            }`}
          >
            <div className="route-breakdown__inner">
              <div className="route-breakdown__item">
                <span className="route-breakdown__route">
                  Guincho
                  <LongArrow className="route-breakdown__arrow arrow-yellow" />
                  Você
                </span>
                <span className="route-breakdown__values">
                  <span className="route-breakdown__price">
                    R$ {driverRoute.priceEstimate.toFixed(0)}
                  </span>
                  <span className="route-breakdown__distance">
                    {driverRoute.distanceKm.toFixed(0)} km
                  </span>
                </span>
              </div>

              <div className="route-breakdown__item">
                <span className="route-breakdown__route">
                  Você
                  <LongArrow className="route-breakdown__arrow arrow-orange" />
                  Destino
                </span>
                <span className="route-breakdown__values">
                  <span className="route-breakdown__price">
                    R$ {userRoute.priceEstimate.toFixed(0)}
                  </span>
                  <span className="route-breakdown__distance">
                    {userRoute.distanceKm.toFixed(0)} km
                  </span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

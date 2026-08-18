import { MapPin, Clock, DollarSign, ChevronRight } from "lucide-react";
import "../../styles/TripDetails.css";

interface TripDetailsProps {
    distanceKm: number;
    durationHours: number;
    priceEstimate: number;
    onMoreDetails?: () => void;
}

export default function TripDetails({
    distanceKm,
    durationHours,
    priceEstimate,
    onMoreDetails,
}: TripDetailsProps) {
    return (
        <div className="trip-details">
            <ul className="trip-details__list">
                <li className="trip-details__item">
                    <MapPin size={16} className="trip-details__icon" />
                    <span className="trip-details__text">
                        <span className="trip-details__label">Distância total:</span>{" "}
                        <span className="trip-details__value">{distanceKm.toFixed(1)} Km</span>
                    </span>
                </li>
                <li className="trip-details__item">
                    <Clock size={16} className="trip-details__icon" />
                    <span className="trip-details__text">
                        <span className="trip-details__label">Tempo médio:</span>{" "}
                        <span className="trip-details__value">{durationHours.toFixed(1)} h</span>
                    </span>
                </li>
                <li className="trip-details__item">
                    <DollarSign size={16} className="trip-details__icon" />
                    <span className="trip-details__text">
                        <span className="trip-details__label">Preço estimado:</span>{" "}
                        <span className="trip-details__value trip-details__value--price">
                            R$ {priceEstimate.toFixed(0)}
                        </span>
                    </span>
                </li>
            </ul>
            {onMoreDetails && (
                <button className="trip-details__more" onClick={onMoreDetails}>
                    <span>Mais detalhes</span>
                    <ChevronRight size={16} />
                </button>
            )}
        </div>
    );
}
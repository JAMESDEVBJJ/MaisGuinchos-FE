import { X, MapPin, Clock } from "lucide-react";
import { formatMinutes } from "../../utils/formatMin";

interface RoutePanelProps {
  distanceKm: number;
  durationMin: number;
  price: number;
  onClose: () => void;
}

export default function RoutePanel({
  distanceKm,
  durationMin,
  price,
  onClose,
}: RoutePanelProps) {
  return (
    <div className="route-overlay" onClick={onClose}>
      <div className="route-panel" onClick={(e) => e.stopPropagation()}>
        <div className="route-panel-header">
          <h3>Detalhes da viagem</h3>
          <button
            type="button"
            className="route-panel-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="route-panel-body">
          <div className="route-panel-row">
            <span className="route-panel-row-label">
              <MapPin size={18} className="route-panel-icon" />
              Distância
            </span>
            <span className="route-panel-row-value">
              {distanceKm.toFixed(1)} km
            </span>
          </div>

          <div className="route-panel-row">
            <span className="route-panel-row-label">
              <Clock size={18} className="route-panel-icon" />
              Duração
            </span>
            <span className="route-panel-row-value">
              {formatMinutes(durationMin)}
            </span>
          </div>
        </div>

        <div className="route-panel-price-box">
          <span className="route-panel-price-label">Preço estimado</span>
          <span className="route-panel-price-value">R$ {price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

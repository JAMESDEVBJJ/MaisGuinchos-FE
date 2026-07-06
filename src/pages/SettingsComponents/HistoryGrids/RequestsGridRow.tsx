import { useState } from "react";
import type { TowRequestHistoryDto } from "../../../dtos/TowRequestHistoryDTO";

type Props = {
  request: TowRequestHistoryDto;
};

function RequestsGridRow({ request }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="history-grid-item">
      <div
        className="history-grid-row-header"
        onClick={() => setExpanded(!expanded)}
      >
        <span>{request.status}</span>
        <span>{request.driverName}</span>
        <span>{request.totalDistanceKm.toFixed(2)} Km</span>
        <span>{request.durationMinutes.toFixed(2)} min</span>
        <span>{request.suggestedPrice?.toFixed(2)} R$</span>

        <span className={`arrow orange ${expanded ? "open" : ""}`}>▼</span>
      </div>

      <div className={`history-grid-row-details ${expanded ? "open" : ""}`}>
        <div>
          <strong>Solicitado em</strong>
          <span>{request.createdAt}</span>
        </div>

        <div>
          <strong>Origem</strong>
          <span>
            Lat: {request.pickupLat} Lon:{request.pickupLon}
          </span>
        </div>

        <div>
          <strong>Destino</strong>
          <span>
            Lat: {request.dropoffLat} Lon: {request.dropoffLon}
          </span>
        </div>

        <div>
          <strong>Veículo</strong>
          <span>{request.vehicleType || "-"}</span>
        </div>

        <div>
          <strong>Problema</strong>
          <span>{request.vehicleIssue || "-"}</span>
        </div>

        <div>
          <strong>Observações</strong>
          <span>{request.notes || "-"}</span>
        </div>
      </div>
    </div>
  );
}

export default RequestsGridRow;

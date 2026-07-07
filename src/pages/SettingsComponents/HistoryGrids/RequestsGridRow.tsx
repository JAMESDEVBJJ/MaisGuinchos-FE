import { useState } from "react";
import type { TowRequestHistoryDto } from "../../../dtos/TowRequestHistoryDTO";
import { getTowRequestStatusInfo } from "../../../utils/towsRequestsUtils";
import { formatDate, formatMinutes } from "../../../utils/formatMin";

type Props = {
  request: TowRequestHistoryDto;
};

function RequestsGridRow({ request }: Props) {
  const [expanded, setExpanded] = useState(false);

  const status = getTowRequestStatusInfo(request.status);
  const Icon = status.icon;

  return (
    <div className="history-grid-item">
      <div
        className="history-grid-row-header"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="status-history-row">
          <span>{status.label}</span>
          <Icon size={16} color={status.color} strokeWidth={2.3} />
        </td>

        <span>{request.driverName}</span>
        <span>
          {new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
          }).format(request.totalDistanceKm)}{" "}
          Km
        </span>
        <span>{formatMinutes(request.durationMinutes)} </span>
        <span>
          {" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(request.suggestedPrice)}
        </span>

        <span className={`arrow ${expanded ? "open" : ""}`}>▼</span>
      </div>

      <div className={`history-grid-row-details ${expanded ? "open" : ""}`}>
        <div>
          <strong>Solicitado em</strong>
          <span>
            {formatDate(request.createdAt)}
          </span>
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

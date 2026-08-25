import { useState } from "react";
import type { TowTravelHistoryResponseDTO } from "../../../dtos/towTravel/TowTravelHistoryResponseDTO";
import { getTowTravelStatusInfo } from "../../../utils/towTravelUtils";
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatMinutes,
  formatPhoneNumber,
} from "../../../utils/formatMin";

type Props = {
  travel: TowTravelHistoryResponseDTO;
};

function TravelsGridRow({ travel }: Props) {
  const [expanded, setExpanded] = useState(false);

  const status = getTowTravelStatusInfo(travel.status);
  const Icon = status.icon;

  const distance =
    travel.distanceToDestinationKm && travel.distanceToPickupKm
      ? travel.distanceToDestinationKm + travel.distanceToPickupKm
      : null;

  const min =
    travel.timeToPickupMin && travel.timeToDestinationMin
      ? travel.timeToDestinationMin + travel.timeToPickupMin
      : null;

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

        <span>{travel.driverName}</span>
        <span>{distance ? formatDistance(distance) : "-"} Km</span>
        <span>{min ? formatMinutes(min) : "-"}</span>
        <span>{formatCurrency(travel.finalPrice)}</span>

        <span className={`arrow ${expanded ? "open" : ""}`}>▼</span>
      </div>

      <div className={`history-grid-row-details ${expanded ? "open" : ""}`}>
        <div>
          <strong>Motorista</strong>
          <span>{travel.driverName}</span>
        </div>

        <div>
          <strong>Telefone</strong>
          <span>{formatPhoneNumber(travel.driverPhone)}</span>
        </div>

        <div>
          <strong>Guincho</strong>
          <span>
            {travel.driverTowModel} • {travel.driverTowPlate}
          </span>
        </div>

        <div>
          <strong>Cliente</strong>
          <span>{travel.clientName}</span>
        </div>

        <div>
          <strong>Iniciada em</strong>
          <span>{travel.startedAt ? formatDate(travel.startedAt) : "-"}</span>
        </div>

        <div>
          <strong>Finalizada em</strong>
          <span>{travel.endedAt ? formatDate(travel.endedAt) : "-"}</span>
        </div>

        <div>
          <strong>Origem</strong>
          <span>{travel.originAddress}</span>
        </div>

        <div>
          <strong>Destino</strong>
          <span>{travel.destinationAddress}</span>
        </div>

        {travel.cancellationReason && (
          <div>
            <strong>Motivo do cancelamento</strong>
            <span>{travel.cancellationReason}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default TravelsGridRow;

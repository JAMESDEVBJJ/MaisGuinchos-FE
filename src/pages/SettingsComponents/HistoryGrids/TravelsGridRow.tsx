import { useState } from "react";
import type { TowTravelHistoryResponseDTO } from "../../../dtos/towTravel/TowTravelHistoryResponseDTO";
import { getTowTravelStatusInfo } from "../../../utils/towTravelUtils";

type Props = {
  travel: TowTravelHistoryResponseDTO;
};

function TravelsGridRow({ travel }: Props) {
  const [expanded, setExpanded] = useState(false);

  const status = getTowTravelStatusInfo(travel.status);
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

        <span>{travel.driverName}</span>
        <span>{} Km</span>
        <span>{} min</span>
        <span>{} R$</span>

        <span className={`arrow orange ${expanded ? "open" : ""}`}>▼</span>
      </div>

      <div className={`history-grid-row-details ${expanded ? "open" : ""}`}>
        <div>
          <strong>Motorista</strong>
          <span>{travel.driverName}</span>
        </div>

        <div>
          <strong>Telefone</strong>
          <span>{travel.driverName}</span>
        </div>

        <div>
          <strong>Guincho</strong>
          <span>
            {} • {}
          </span>
        </div>

        <div>
          <strong>Cliente</strong>
          <span>{travel.clientName}</span>
        </div>

        <div>
          <strong>Iniciada em</strong>
          <span>{travel.startedAt ?? "-"}</span>
        </div>

        <div>
          <strong>Finalizada em</strong>
          <span>{travel.endedAt ?? "-"}</span>
        </div>

        <div>
          <strong>Origem</strong>
          <span>{}</span>
        </div>

        <div>
          <strong>Destino</strong>
          <span>{}</span>
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

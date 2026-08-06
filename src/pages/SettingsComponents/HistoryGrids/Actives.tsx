import { useTowRequest } from "../../../contexts/TowRequestsContext";
import {
  formatCurrency,
  formatDistance,
  formatMinutes,
} from "../../../utils/formatMin";
import { getTowRequestStatusInfo } from "../../../utils/towsRequestsUtils";
import ActivesGridRow from "./ActivesGridRow";

function ActiveRequestsGrid() {
  const { activeTowsRequests } = useTowRequest();

  return activeTowsRequests.length > 0 ? (
    <div className="history-grid">
      <div className="history-grid-header">
        <span>Status</span>
        <span>Motorista</span>
        <span>Distância</span>
        <span>Tempo</span>
        <span>Preço</span>
      </div>

      <div className="history-grid-body">
        {activeTowsRequests.map((tow) => (
          <ActivesGridRow
            key={tow.id}
            status={getTowRequestStatusInfo(tow.status)}
            driver={tow.driverName}
            distance={`${formatDistance(tow.totalDistanceKm)} Km`}
            time={`${formatMinutes(tow.durationMinutes)}`}
            price={` ${formatCurrency(tow.suggestedPrice)}`}
            driverId={tow.driverId}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="history-grid-placeholder">Sem solicitações pendentes.</div>
  );
}

export default ActiveRequestsGrid;
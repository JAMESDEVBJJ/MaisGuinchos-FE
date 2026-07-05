import { useTowRequest } from "../../../contexts/TowRequestsContext";
import HistoryGridRow from "./HistoryGridRow";

function ActiveRequestsGrid() {
  const { activeTowsRequests } = useTowRequest();

  return (
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
          <HistoryGridRow
            key={tow.id}
            status={getTowRequestStatus(tow.status)}
            driver={tow.driverName}
            distance={`${tow.totalDistanceKm.toFixed(2)} km`}
            time={`${tow.durationMinutes.toFixed(2)} min`}
            price={`R$ ${tow.suggestedPrice}`}
          />
        ))}
      </div>

      {/* Caso não exista nenhuma solicitação */}
      {/* <div className="history-grid-empty">
        Nenhuma solicitação ativa.
      </div> */}
    </div>
  );
}

export default ActiveRequestsGrid;

function getTowRequestStatus(status: number): string {
  switch (status) {
    case 1:
      return "Aguardando resposta do motorista";

    case 2:
      return "Contraproposta enviada";

    case 3:
      return "Contraproposta recusada";

    case 4:
      return "Aceita";

    case 5:
      return "Recusada";

    case 6:
      return "Cancelada";

    default:
      return "Status desconhecido";
  }
}

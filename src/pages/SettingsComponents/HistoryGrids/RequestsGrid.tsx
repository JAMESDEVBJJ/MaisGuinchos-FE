import type { TowRequestHistoryDto } from "../../../dtos/TowRequestHistoryDTO";
import RequestsGridRow from "./RequestsGridRow";

type Props = {
  requests: TowRequestHistoryDto[];
};

function RequestsGrid({ requests }: Props) {
  if (requests.length === 0) {
    return (
      <div className="history-grid-placeholder">
        Aqui ficará o histórico de solicitações
      </div>
    );
  }

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
        {" "}
        {requests.map((request) => (
          <RequestsGridRow key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}

export default RequestsGrid;

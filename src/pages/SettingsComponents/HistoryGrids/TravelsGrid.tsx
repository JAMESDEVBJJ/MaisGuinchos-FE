import type { TowTravelHistoryResponseDTO } from "../../../dtos/towTravel/TowTravelHistoryResponseDTO";
import TravelsGridRow from "./TravelsGridRow";

type Props = {
    travels: TowTravelHistoryResponseDTO[];
};

function TravelsGrid({ travels }: Props) {
  if (travels.length === 0) {
    return (
      <div className="history-grid-placeholder">
        Aqui ficará o histórico de corridas
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
        {travels.map((travel) => (
          <TravelsGridRow key={travel.id} travel={travel} />
        ))}
      </div>
    </div>
  );
}

export default TravelsGrid;

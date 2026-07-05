import { ChevronDown } from "lucide-react";
import { useState } from "react";
import "../../styles/HistoryPage.css"
import ActiveRequestsGrid from "./HistoryGrids/Actives";

function History() {
  const [openedSections, setOpenedSections] = useState({
    actives: true,
    requests: false,
    travels: false,
  });

  const toggleSection = (section: keyof typeof openedSections) => {
    setOpenedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="history-page">
      <div className="history-section">
        <button
          className="history-header"
          onClick={() => toggleSection("actives")}
        >
          <span>Solicitações ativas</span>

          <ChevronDown
            size={20}
            className={openedSections.actives ? "arrow open" : "arrow"}
          />
        </button>

        <div
          className={`history-content ${
            openedSections.actives ? "open" : ""
          }`}
        >
          <ActiveRequestsGrid></ActiveRequestsGrid>
        </div>
      </div>

      <div className="history-section">
        <button
          className="history-header"
          onClick={() => toggleSection("requests")}
        >
          <span>Histórico de solicitações</span>

          <ChevronDown
            size={20}
            className={openedSections.requests ? "arrow open" : "arrow"}
          />
        </button>

        <div
          className={`history-content ${
            openedSections.requests ? "open" : ""
          }`}
        >
          <div className="history-grid-placeholder">
            Aqui ficará o histórico de solicitações
          </div>
        </div>
      </div>

      <div className="history-section">
        <button
          className="history-header"
          onClick={() => toggleSection("travels")}
        >
          <span>Histórico de corridas</span>

          <ChevronDown
            size={20}
            className={openedSections.travels ? "arrow open" : "arrow"}
          />
        </button>

        <div
          className={`history-content ${
            openedSections.travels ? "open" : ""
          }`}
        >
          <div className="history-grid-placeholder">
            Aqui ficará o histórico de corridas
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
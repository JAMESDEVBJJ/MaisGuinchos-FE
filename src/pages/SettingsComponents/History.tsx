import { useState } from "react";
import "../../styles/HistoryPage.css";
import ActiveRequestsGrid from "./HistoryGrids/Actives";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronDown } from "lucide-react";
import RequestsGridRow from "./HistoryGrids/RequestsGridRow";
import { api } from "../../services/api";
import type { TowRequestHistoryDto } from "../../dtos/TowRequestHistoryDTO";
import RequestsGrid from "./HistoryGrids/RequestsGrid";

function History() {
  const [openedSections, setOpenedSections] = useState({
    actives: true,
    requests: false,
    travels: false,
  });

  const { user } = useAuth();

  const [historyRequests, setHistoryRequests] = useState<
    TowRequestHistoryDto[]
  >([]);

  async function loadTowRequests() {
    if (!user) return;
    try {
      const response = await api.get(`/towRequests/${user!.id}/all`);

      const data: TowRequestHistoryDto[] = response.data;

      console.dir(data);

      setHistoryRequests(data);
    } catch (error) {
      console.error(error);
      setHistoryRequests([]);
    }
  }

  const toggleSection = async (section: "requests" | "travels" | "actives") => {
    const willOpen = !openedSections[section];

    setOpenedSections((prev) => ({
      ...prev,
      [section]: willOpen,
    }));

    if (section === "requests" && willOpen && historyRequests.length === 0) {
      await loadTowRequests();
    }
  };

  return (
    <div className="history-page">
      {user?.isClient && (
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
      )}

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
          className={`history-content ${openedSections.requests ? "open" : ""}`}
        >
          <RequestsGrid requests={historyRequests} />
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
          className={`history-content ${openedSections.travels ? "open" : ""}`}
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

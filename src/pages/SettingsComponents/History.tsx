import { useState } from "react";
import "../../styles/HistoryPage.css";
import ActiveRequestsGrid from "./HistoryGrids/Actives";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronDown } from "lucide-react";
import { api } from "../../services/api";
import type { TowRequestHistoryDto } from "../../dtos/TowRequestHistoryDTO";
import RequestsGrid from "./HistoryGrids/RequestsGrid";
import TravelsGrid from "./HistoryGrids/TravelsGrid";
import type { TowTravelHistoryResponseDTO } from "../../dtos/towTravel/TowTravelHistoryResponseDTO";
import { LoadingSpinner } from "../Ui/LoadingSpinner";
import type { PaginatedResponse } from "../../dtos/PaginatedResponse";
import { Pagination } from "../Ui/Pagination";

function History() {
  const [openedSections, setOpenedSections] = useState({
    actives: true,
    requests: false,
    travels: false,
  });

  const { user } = useAuth();

  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingTravels, setLoadingTravels] = useState(false);

  const [historyRequests, setHistoryRequests] =
    useState<PaginatedResponse<TowRequestHistoryDto> | null>(null);

  const [historyTravels, setHistoryTravels] =
    useState<PaginatedResponse<TowTravelHistoryResponseDTO> | null>(null);

  async function loadTowRequests(page = 1) {
    if (!user) return;

    setLoadingRequests(true);

    try {
      const response = await api.get(
        `/towRequests/${user.id}/all?page=${page}&pageSize=10`
      );

      setHistoryRequests(response.data);
    } catch (error) {
      console.error(error);
      setHistoryRequests(null);
    } finally {
      setLoadingRequests(false);
    }
  }
  async function loadTowTravels(page = 1) {
    if (!user) return;

    setLoadingTravels(true);

    try {
      const response = await api.get(
        `/TowTravel/${user!.id}/all?page=${page}&pageSize=10`
      );

      const data: PaginatedResponse<TowTravelHistoryResponseDTO> =
        response.data;

      setHistoryTravels(data);
    } catch (error) {
      console.error(error);
      setHistoryTravels(null);
    } finally {
      setLoadingTravels(false);
    }
  }

  const toggleSection = async (section: "requests" | "travels" | "actives") => {
    const willOpen = !openedSections[section];

    setOpenedSections((prev) => ({
      ...prev,
      [section]: willOpen,
    }));

    if (
      section === "requests" &&
      willOpen &&
      (!historyRequests || historyRequests.items.length === 0)
    ) {
      await loadTowRequests();
    }

    if (
      section === "travels" &&
      willOpen &&
      (!historyTravels || historyTravels.items.length === 0)
    ) {
      await loadTowTravels();
    }
  };

  return (
    <div className="history-page">
      <h1>Históricos</h1>

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
          {loadingRequests ? (
            <LoadingSpinner />
          ) : (
            <>
              <RequestsGrid requests={historyRequests?.items ?? []} />
            </>
          )}
        </div>
        {openedSections.requests &&
          historyRequests &&
          historyRequests.totalPages > 1 && (
            <Pagination
              page={historyRequests.page}
              totalPages={historyRequests.totalPages}
              totalItems={historyRequests.totalItems}
              pageSize={historyRequests.pageSize}
              onPageChange={loadTowRequests}
              isLoading={loadingRequests}
            />
          )}
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
          {loadingTravels ? (
            <LoadingSpinner />
          ) : (
            <>
              <TravelsGrid travels={historyTravels?.items ?? []} />
            </>
          )}
        </div>
        {openedSections.travels &&
          historyTravels &&
          historyTravels.totalPages > 1 && (
            <Pagination
              page={historyTravels.page}
              totalPages={historyTravels.totalPages}
              totalItems={historyTravels.totalItems}
              pageSize={historyTravels.pageSize}
              onPageChange={loadTowTravels}
              isLoading={loadingTravels}
            />
          )}
      </div>
    </div>
  );
}

export default History;

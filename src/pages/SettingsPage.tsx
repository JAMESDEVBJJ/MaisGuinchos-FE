import { useState, useEffect } from "react";
import "../styles/SettingsPage.css";
import Perfil from "./SettingsComponents/Profile";
import Notifications from "./SettingsComponents/Notifications";
import History from "./SettingsComponents/History";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { TowTravelResponseDTO } from "../dtos/towTravel/TowTravelResponseDTO";
import type { TowTravelDTO } from "../dtos/TowTravelDTO";
import { useTowTravel } from "../contexts/TowTravelContext";

function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("perfil");

  const navigate = useNavigate();

  const { setTowTravel } = useTowTravel();

  const handleBack = () => {
    navigate("/homepage");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "perfil":
        return <Perfil />;
      case "historico":
        return <History />;
      case "notificacoes":
        return <Notifications />;
      default:
        return <Perfil />;
    }
  };

  useEffect(() => {
    const loadTow = async () => {
      const response = await api.get("/towTravel/pending");

      const towPending: TowTravelResponseDTO | null = response.data;
      if (towPending) {
        const towTravel: TowTravelDTO = {
          towRequestId: towPending.towRequestId,
          id: towPending.id,

          driverId: towPending.driverId,
          driverName: towPending.driverName,
          driverPhone: towPending.driverPhone,
          vehicleColorDriver: towPending.vehicleColorDriver,
          placaDriver: towPending.placaDriver,

          clientName: towPending.clientName,
          clientPhone: towPending.clientPhone,
          questions: towPending.questions,
          notes: towPending.notes,
          vehicleModelClient: towPending.vehicleModelClient,

          finalPrice: towPending.finalPrice,

          distanceToPickupKm: towPending.distanceToPickupKm,
          timeToPickupMin: towPending.timeToPickupMin,

          distanceToDestinationKm: towPending.distanceToDestinationKm,
          timeToDestinationMin: towPending.timeToDestinationMin,
          status: towPending.status,

          origin: towPending.origin,
          pickup: towPending.pickup,
          destination: towPending.destination,
          truck: {
            id: towPending.truck.id,
            model: towPending.truck.model,
            color: towPending.truck.color,
            plate: towPending.truck.plate,
          },
          driverPhoto: towPending.driverPhoto,
        };
        setTowTravel(towTravel);
      }
    };

    loadTow();
  }, []);

  return (
    <div className="settings-page">
      <aside className="sidebar-settings">
        <div className="sidebar-settings-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft size={22} />
          </button>
          <h2>Menu</h2>
        </div>

        <button
          className={selectedTab === "perfil" ? "active" : ""}
          onClick={() => setSelectedTab("perfil")}
        >
          Perfil
        </button>

        <button
          className={selectedTab === "historico" ? "active" : ""}
          onClick={() => setSelectedTab("historico")}
        >
          Histórico de reboques
        </button>

        <button
          className={selectedTab === "notificacoes" ? "active" : ""}
          onClick={() => setSelectedTab("notificacoes")}
        >
          Notificações
        </button>
      </aside>

      <main className="content">{renderContent()}</main>
    </div>
  );
}

export default SettingsPage;

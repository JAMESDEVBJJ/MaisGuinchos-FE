import { useState } from "react";
import "../styles/SettingsPage.css";
import Perfil from "./SettingsComponents/Profile";
import Notifications from "./SettingsComponents/Notifications";
import History from "./SettingsComponents/History";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("perfil");

  const navigate = useNavigate();

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

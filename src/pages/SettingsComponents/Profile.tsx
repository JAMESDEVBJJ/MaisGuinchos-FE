import { ChevronDown, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/ProfilePage.css";
import ProfileInfo from "./Profile/ProfileInfo";
import { api } from "../../services/api";
import Security from "./Profile/Security";
import type { TowDTO } from "../../dtos/TowDTO";
import ProfileTow from "./Profile/ProfileTow";
import { useNavigate } from "react-router-dom";
type UserProfile = {
  name: string;
  userName: string;
  email: string;
  numeroTelefone: string;
  cpf: string;
  tipo: string;
  guincho?: TowDTO;
};
function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openedSections, setOpenedSections] = useState({
    profileInfo: false,
    security: false,
    tow: false,
  });
  useEffect(() => {
    async function loadProfile() {
      const response = await api.get("/user/me");
      setProfile(response.data);
      console.dir(response.data);
    }
    loadProfile();
  }, []);
  const toggleSection = (section: "profileInfo" | "security" | "tow") => {
    const willOpen = !openedSections[section];
    setOpenedSections((prev) => ({
      ...prev,
      [section]: willOpen,
    }));
  };
  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      navigate("/login");
    }
  };
  return (
    <div className="perfil-page">
      <h1>Perfil</h1>
      <div className="perfil-section">
        <button
          className="perfil-header"
          onClick={() => toggleSection("profileInfo")}
        >
          <span>Informações pessoais</span>
          <ChevronDown
            size={20}
            className={openedSections.profileInfo ? "arrow open" : "arrow"}
          />
        </button>
        <div
          className={`perfil-content ${openedSections.profileInfo ? "open" : ""
            }`}
        >
          {openedSections.profileInfo && profile && (
            <ProfileInfo user={profile} setProfile={setProfile} />
          )}
        </div>
      </div>
      <div className="perfil-section">
        <button
          className="perfil-header"
          onClick={() => toggleSection("security")}
        >
          <span>Segurança</span>
          <ChevronDown
            size={20}
            className={openedSections.security ? "arrow open" : "arrow"}
          />
        </button>
        <div
          className={`perfil-content ${openedSections.security ? "open" : ""}`}
        >
          {openedSections.security && <Security />}
        </div>
      </div>
      {user?.isDriver && profile?.guincho && (
        <div className="perfil-section">
          <button
            className="perfil-header"
            onClick={() => toggleSection("tow")}
          >
            <span>Guincho</span>
            <ChevronDown
              size={20}
              className={openedSections.tow ? "arrow open" : "arrow"}
            />
          </button>
          <div className={`perfil-content ${openedSections.tow ? "open" : ""}`}>
            {openedSections.tow && profile && (
              <ProfileTow guincho={profile.guincho} setProfile={setProfile} />
            )}
          </div>
        </div>
      )}
      <div className="logout-wrapper">
        <button
          className="logout-button"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logout-modal-header">
              <h2>Confirmar saída</h2>
              <button
                className="close-modal-button"
                onClick={() => setShowLogoutModal(false)}
              >
                <X size={18} />
              </button>
            </div>
            <p>Tem certeza que deseja sair da sua conta?</p>
            <div className="logout-modal-actions">
              <button
                className="cancel-button"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancelar
              </button>
              <button
                className="confirm-logout-button"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Profile;
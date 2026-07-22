import { ChevronDown } from "lucide-react";
import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/ProfilePage.css";
import ProfileInfo from "./Profile/ProfileInfo";
import { api } from "../../services/api";

type UserProfile = {
  name: string;
  userName: string;
  email: string;
  numeroTelefone: string;
  cpf: string;
  tipo: string;
};

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [openedSections, setOpenedSections] = useState({
    profileInfo: false,
    security: false,
  });

  useEffect(() => {
    async function loadProfile() {
      const response = await api.get("/user/me");
  
      setProfile(response.data);
    }
  
    loadProfile();
  }, []);

  const toggleSection = async (section: "profileInfo" | "security") => {
    const willOpen = !openedSections[section];

    setOpenedSections((prev) => ({
      ...prev,
      [section]: willOpen,
    }));
  };
  return (
    <div className="perfil-page">
      <h1>Página de Perfil</h1>
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
          className={`perfil-content ${
            openedSections.profileInfo ? "open" : ""
          }`}
        >
          {openedSections.profileInfo && profile && <ProfileInfo user={profile} />}
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
          className={`perfil-content ${openedSections.security ? "open" : ""}`} ////{openedSections.security}
        >
          
        </div>
      </div>
    </div>
  );
}

export default Profile;

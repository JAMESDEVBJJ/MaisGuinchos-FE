import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

export function SettingsButton() {
  const navigate = useNavigate();

  return (
    <button 
      className="settings-btn"
      onClick={() => navigate("/settings")}
    >
      <FiSettings size={22} color="gray" />
    </button>
  );
}
import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

export function SettingsButton() {
  const navigate = useNavigate();
  
  const SettingsIcon = FiSettings as any;

  return (
    <button className="settings-btn" onClick={() => navigate("/settings")}>
      <SettingsIcon size={22} color="gray" />
    </button>
  );
}

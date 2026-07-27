import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  status: {
    label: string;
    icon: LucideIcon;
    color: string;
  };
  driver: string;
  driverId: string;
  distance: string;
  time: string;
  price: string;
};

function ActivesGridRow({
  status,
  driver,
  distance,
  time,
  price,
  driverId,
}: Props) {
  const Icon = status.icon;

  const navigate = useNavigate();
  return (
    <div className="history-grid-item">
      <div
        className="history-grid-row-header"
        onClick={() =>
          navigate("/homepage", {
            state: {
              driverId: driverId,
            },
          })
        }
      >
        <td className="status-history-row">
          <span>{status.label}</span>
          <Icon size={16} color={status.color} strokeWidth={2.3} />
        </td>
        <span>{driver}</span>
        <span>{distance}</span>
        <span>{time}</span>
        <span>{price}</span>
      </div>
    </div>
  );
}

export default ActivesGridRow;

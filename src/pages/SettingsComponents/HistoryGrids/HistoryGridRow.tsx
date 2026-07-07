import type { LucideIcon } from "lucide-react";

type Props = {
  status: {
    label: string;
    icon: LucideIcon;
    color: string;
  };
  driver: string;
  distance: string;
  time: string;
  price: string;
};

function HistoryGridRow({ status, driver, distance, time, price }: Props) {
  const Icon = status.icon;
  return (
    <div className="history-grid-item">
      <div className="history-grid-row-header">
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

export default HistoryGridRow;

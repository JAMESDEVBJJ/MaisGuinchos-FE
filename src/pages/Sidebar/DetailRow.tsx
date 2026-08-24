import {
  CircleAlert,
  Car,
  StickyNote,
  Truck,
  Hash,
  Palette,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/DetailRow.css";

type DetailRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="extra-row">
      <span className="extra-icon">{icon}</span>
      <div className="extra-content">
        <span className="extra-label">{label}</span>
        <span className="extra-value">{value}</span>
      </div>
    </div>
  );
}

type TowExtraDetailsProps = {
  questions?: string | null;
  vehicleModel?: string | null;
  notes?: string | null;

  towVehicleModel?: string | null;
  towVehiclePlate?: string | null;
  towVehicleColor?: string | null;
};

export function TowExtraDetails({
  questions,
  vehicleModel,
  notes,
  towVehicleModel,
  towVehiclePlate,
  towVehicleColor,
}: TowExtraDetailsProps) {
  const { user } = useAuth();

  if (user?.isClient) {
    return (
      <div className="tow-extra">
        <div className="extra-header">Detalhes do guincho</div>

        <DetailRow
          icon={<Truck size={18} strokeWidth={1.75} />}
          label="Modelo"
          value={
            towVehicleModel && towVehicleModel !== ""
              ? towVehicleModel
              : "Modelo não informado."
          }
        />

        <DetailRow
          icon={<Hash size={18} strokeWidth={1.75} />}
          label="Placa"
          value={
            towVehiclePlate && towVehiclePlate !== ""
              ? towVehiclePlate
              : "Placa não informada."
          }
        />

        <DetailRow
          icon={<Palette size={18} strokeWidth={1.75} />}
          label="Cor"
          value={
            towVehicleColor && towVehicleColor !== ""
              ? towVehicleColor
              : "Cor não informada."
          }
        />
      </div>
    );
  }

  const hasNotes = !!notes && notes.trim() !== "";

  return (
    <div className="tow-extra">
      <div className="extra-header">Detalhes do veículo</div>

      <DetailRow
        icon={<CircleAlert size={18} strokeWidth={1.75} />}
        label="Questão"
        value={questions ?? "Veículo sem questões."}
      />

      <DetailRow
        icon={<Car size={18} strokeWidth={1.75} />}
        label="Modelo"
        value={
          vehicleModel && vehicleModel !== ""
            ? vehicleModel
            : "Sem modelo informado."
        }
      />

      {hasNotes && (
        <DetailRow
          icon={<StickyNote size={18} strokeWidth={1.75} />}
          label="Notas"
          value={notes!}
        />
      )}
    </div>
  );
}

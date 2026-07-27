import { Truck, MapPin, Route, Flag, CheckCircle2, Ban } from "lucide-react";
import { TowTravelStatus } from "./enums/TowTravelStatus";

export function getTowTravelStatusInfo(status: TowTravelStatus) {
  switch (status) {
    case TowTravelStatus.GoingToClient:
      return {
        label: "Indo ao cliente",
        icon: Truck,
        color: "#3b82f6",
      };

    case TowTravelStatus.ArrivedAtPickup:
      return {
        label: "Chegou à coleta",
        icon: MapPin,
        color: "#f59e0b",
      };

    case TowTravelStatus.InProgress:
      return {
        label: "Em viagem",
        icon: Route,
        color: "#8b5cf6",
      };

    case TowTravelStatus.ArrivedAtDestination:
      return {
        label: "Chegou ao destino",
        icon: Flag,
        color: "#06b6d4",
      };

    case TowTravelStatus.Finished:
      return {
        label: "Finalizada",
        icon: CheckCircle2,
        color: "#22c55e",
      };

    case TowTravelStatus.Cancelled:
      return {
        label: "Cancelada",
        icon: Ban,
        color: "#6b7280",
      };

    default:
      return {
        label: "Desconhecido",
        icon: Ban,
        color: "#9ca3af",
      };
  }
}

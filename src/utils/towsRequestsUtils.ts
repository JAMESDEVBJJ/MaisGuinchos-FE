import {
  Clock3,
  CheckCircle2,
  XCircle,
  Ban,
  BadgeDollarSign,
} from "lucide-react";

export enum TowRequestStatus {
  WaitingDriverResponse = 1,
  CounterOfferSent = 2,
  CounterOfferRejected = 3,
  Accepted = 4,
  Rejected = 5,
  Cancelled = 6,
}

export function getTowRequestStatusInfo(status: TowRequestStatus) {
  switch (status) {
    case TowRequestStatus.WaitingDriverResponse:
      return {
        label: "Aguardando",
        icon: Clock3,
        color: "#f59e0b",
      };

    case TowRequestStatus.CounterOfferSent:
      return {
        label: "Contra oferta",
        icon: BadgeDollarSign,
        color: "#3b82f6",
      };

    case TowRequestStatus.CounterOfferRejected:
      return {
        label: "Contra oferta recusada",
        icon: XCircle,
        color: "#ef4444",
      };

    case TowRequestStatus.Accepted:
      return {
        label: "Aceita",
        icon: CheckCircle2,
        color: "#22c55e",
      };

    case TowRequestStatus.Rejected:
      return {
        label: "Rejeitada",
        icon: XCircle,
        color: "#ef4444",
      };

    case TowRequestStatus.Cancelled:
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

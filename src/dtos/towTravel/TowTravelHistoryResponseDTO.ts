import type { TowTravelStatus } from "../../utils/enums/TowTravelStatus";

export interface TowTravelHistoryResponseDTO {
  id: string;

  towRequestId: string;

  driverId: string;
  driverName: string;

  clientId: string;
  clientName: string;

  finalPrice: number;

  distanceToPickupKm: number | null;
  timeToPickupMin: number | null;

  distanceToDestinationKm: number | null;
  timeToDestinationMin: number | null;

  status: TowTravelStatus;

  startedAt: string | null;
  endedAt: string | null;
  canceledAt: string | null;

  cancellationReason: string;
}

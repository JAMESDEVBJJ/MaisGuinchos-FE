import type { TowTravelStatus } from "../utils/enums/TowTravelStatus";
import type { LocationDTO } from "./towTravel/TowTravelResponseDTO";

export interface TowTravelDTO {
  id: string;

  clientName?: string;
  clientPhone?: string;
  vehicleModelClient: string;

  driverName?: string;
  driverPhone?: string;
  vehicleModelDriver?: string;
  vehicleColorDriver?: string;
  placaDriver?: string;
  driverId: string;
  driverPhoto: string;
  towRequestId: string;

  finalPrice: number;

  distanceToPickupKm: number;
  timeToPickupMin: number;

  distanceToDestinationKm: number;
  timeToDestinationMin: number;

  origin: LocationDTO;
  pickup: LocationDTO;
  destination: LocationDTO;

  status: TowTravelStatus;

  startedAt?: string;
  endedAt?: string;
  canceledAt?: string;
  cancellationReason?: string;

  truck: {
    id: string;
    model: string;
    color: string;
    plate: string;
  };
  notes?: string;
  questions?: string;
}

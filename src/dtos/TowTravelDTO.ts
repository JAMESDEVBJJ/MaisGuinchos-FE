import type { TowTravelStatus } from "../utils/enums/TowTravelStatus";

export interface TowTravelDTO {
    id: string;
  
    driverId: string;
    towRequestId: string;
  
    finalPrice: number;

    distanceToPickupKm: number;
    timeToPickupMin: number;
  
    distanceToDestinationKm: number;
    timeToDestinationMin: number;
  
    status: TowTravelStatus;
  
    startedAt?: string;
    endedAt?: string;
    canceledAt?: string;
    cancellationReason?: string;
  }
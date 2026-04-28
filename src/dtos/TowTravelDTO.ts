export interface TowTravelDTO {
    id: string;
  
    driverId: string;
    towRequestId: string;
  
    finalPrice: number;

    distanceToPickupKm: number;
    timeToPickupMin: number;
  
    distanceToDestinationKm: number;
    timeToDestinationMin: number;
  
    status: number;
  
    startedAt?: string;
    endedAt?: string;
    canceledAt?: string;
    cancellationReason?: string;
  }
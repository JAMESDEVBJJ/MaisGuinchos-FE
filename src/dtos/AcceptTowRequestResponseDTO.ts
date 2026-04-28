export interface AcceptTowRequestResponseDTO {
    towRequestId: string;
    towTravelId: string;
    towRequestStatus: number;

    towDriverId: string;

    finalPrice: number;
    estimatedArrivalTime: number;
    distanceKm: number;

    distanceToPickupKm: number,
    durationMinToPickup: number,

    distanceToDestinationKm: number,
    durationMinToDestination: number,
  
    driverLat: number;
    driverLon: number;
  
    pickupLat: number;
    pickupLon: number;
  
    destinationLat: number;
    destinationLon: number;
  }
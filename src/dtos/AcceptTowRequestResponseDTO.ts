export interface AcceptTowRequestResponseDTO {
    towRequestId: string;
    towTravelId: string;
    towRequestStatus: number;

    towDriverId: string;

    finalPrice: number;
    estimatedArrivalTime: number;
    distanceKm: number;

    notes?: string;
    questions?: string;
    
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

    truck: {
      id: string;
      model: string;
      color: string;
      plate: string;
    };

    vehicleModel: string;

    driverPhotoUrl: string;
    driverPhone: string;
  }
export interface AcceptTowRequestResponseDTO {
    towRequestId: string;
    towTravelId: string;
    towRequestStatus: number;
  
    driverLat: number;
    driverLon: number;
  
    pickupLat: number;
    pickupLon: number;
  
    destinationLat: number;
    destinationLon: number;
  }
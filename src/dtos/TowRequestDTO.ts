export interface TowRequestDTO {
    id: string;
    clientId: string;
    clientName: string;
    driverId: string;
    driverName: string;
  
    pickupLat: number;
    pickupLon: number;
    dropoffLat: number;
    dropoffLon: number;
  
    totalDistanceKm: number;
    durationMinutes: number;
  
    suggestedPrice: number;
    finalPrice?: number;
  
    counterOfferPrice?: number;
    counterOfferPercent?: number;
    counterOfferReason?: string;
    counterOfferAt?: string;
  
    status: TowStatus;
  
    createdAt: string;
  }

  export enum TowStatus {
    Pending = 0,
    Accepted = 1,
    Rejected = 2,
    Cancelled = 3
  }
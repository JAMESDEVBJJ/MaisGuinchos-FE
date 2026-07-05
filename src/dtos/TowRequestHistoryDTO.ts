export type TowRequestHistoryDto = {
  id: string;

  clientId: string;
  clientName: string;

  driverId: string;
  driverName: string;

  pickupLat: number;
  pickupLon: number;

  dropoffLat: number;
  dropoffLon: number;

  distanceToPickupKm?: number;
  distanceToDestinationKm?: number;
  totalDistanceKm: number;

  durationMinToPickup?: number;
  durationMinToDestination?: number;
  durationMinutes: number;

  suggestedPrice: number;
  finalPrice?: number;

  vehicleType?: string;
  vehicleIssue?: string;
  notes?: string;

  counterOfferPrice?: number;
  counterOfferPercent?: number;
  counterOfferReason?: string;
  counterOfferAt?: string;

  status: number;

  createdAt: string;
  updatedAt?: string;

  hasTravel: boolean;
};

import type { TowRequestStatus } from "../utils/towsRequestsUtils";

export interface TowRequestReceiveDto {
  id: string;
  clientName: string;
  clientId: string;
  clientPhone: string;
  driverName: string;
  driverId: string;
  pickupLat: number;
  pickupLon: number;
  dropoffLat: number;
  dropoffLon: number;
  totalDistanceKm: number;
  durationMinutes: number;
  suggestedPrice: number;
  vehicleType: string | null;
  vehicleIssue?: string | null;
  notes?: string | null;
  createdAt: number;
  status: TowRequestStatus;
  counterOfferRecused?: boolean; 
  counterOfferPrice?: number;
  counterOfferPercent?: number;
  counterOfferReason?: string;
  counterOfferAt?: string;
}
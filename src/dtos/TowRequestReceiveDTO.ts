export interface TowRequestReceiveDto {
  requestId: string;
  clientId: string;
  pickupLat: number;
  pickupLon: number;
  dropoffLat: number;
  dropoffLon: number;
  totalDistanceKm: number;
  durationMinutes: number;
  suggestedPrice: number;
  vehicleType?: string | null;
  vehicleIssue?: string | null;
  notes?: string | null;
}
export interface TowRequestReceiveDto {
  id: string;
  clientName: string;
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
  status: number;
}
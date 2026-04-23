import type { CoordinateDto } from "./CoordinateDTO";

export type RouteType = "DriverToPickup" | "DriverToDestination";

export interface RouteRealtimeDTO {
  type: number;

  origin: CoordinateDto;
  destination: CoordinateDto;

  distanceKm: number;
  durationMinutes: number;
  priceEstimate: number;

  polyline: CoordinateDto[];
}

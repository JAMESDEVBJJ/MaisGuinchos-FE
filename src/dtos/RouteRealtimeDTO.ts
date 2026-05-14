import type { CoordinateDto } from "./CoordinateDTO";

export interface RouteRealtimeDTO {
  type: RouteType;

  origin: CoordinateDto;
  destination: CoordinateDto;

  distanceKm: number;
  durationMinutes: number;
  priceEstimate: number;

  polyline: CoordinateDto[];
}

export enum RouteType {
  DriverToPickup = 0,
  DriverToDestination = 1,
}

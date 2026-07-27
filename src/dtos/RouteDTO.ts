import type { CoordinateDto } from "./CoordinateDTO";

export type RouteDTO = {
    distanceKm: number;
    durationMinutes: number;
    priceEstimate: number;
    polyline: CoordinateDto[];
};
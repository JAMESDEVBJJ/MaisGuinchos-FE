import type { CoordinateDto } from "./CoordinateDTO";

export type RouteDTO = {
    distanceKm: number;
    durationMinutes: number;
    polyline: CoordinateDto[];
};
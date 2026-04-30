import type { TowRequestDTO } from "../dtos/TowRequestDTO";

export function mapToTowRequest(dto: any): TowRequestDTO {
  return {
    id: dto.id,
    clientId: dto.clientId,
    clientName: dto.clientName,
    driverId: dto.driverId,
    driverName: dto.driverName,

    pickupLat: dto.pickupLat,
    pickupLon: dto.pickupLon,
    dropoffLat: dto.dropoffLat,
    dropoffLon: dto.dropoffLon,

    totalDistanceKm: dto.totalDistanceKm,
    durationMinutes: dto.durationMinutes,

    suggestedPrice: dto.suggestedPrice,
    finalPrice: dto.finalPrice,

    counterOfferPrice: dto.counterOfferPrice,
    counterOfferPercent: dto.counterOfferPercent,
    counterOfferReason: dto.counterOfferReason,
    counterOfferAt: dto.counterOfferAt,

    status: dto.status,

    createdAt: dto.createdAt,
  };
}

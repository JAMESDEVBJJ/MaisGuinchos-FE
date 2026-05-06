import type { TowTravelStatus } from "../../utils/enums/TowTravelStatus";

export interface LocationDTO {
    latitude: number;
    longitude: number;
    address?: string;
  }
  
  export interface TowTravelResponseDTO {
    id: string;
  
    driverId: string;
    driverName: string;
    driverPhone: string;
    vehicleModelDriver: string;
    vehicleColorDriver: string;
    placaDriver: string;
  
    clientId: string;
    clientName: string;
    clientPhone: string;
    vehicleModelClient: string;
    notes: string;  
    questions: string;
  
    towRequestId: string;

    finalPrice: number;

    distanceToPickupKm: number;
    timeToPickupMin: number;

    distanceToDestinationKm: number;
    timeToDestinationMin: number;
  
    status: TowTravelStatus;
  
    startedAt?: string;
    endedAt?: string;
    canceledAt?: string;
    cancellationReason?: string;
  
    origin: LocationDTO;
    pickup: LocationDTO;
    destination: LocationDTO;
  }
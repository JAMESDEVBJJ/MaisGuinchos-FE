export type MotoristaDto = {
  userId: string;
  name: string;
  arrivalTime?: number;
  lat: number;
  lon: number;
  foto?: string;
  placa: string;
  number?: string;
};

export type GuinchosDto = {
  motorista: MotoristaDto;
  stars: number;
  available: boolean;
  color: string;
  model: string;
  distanceKm?: number;
};

export type Position = {
  lat: number;
  lon: number;
  name?: string;
};

export type UserDto = {
  userPosition: Position;
  userId?: string;
  userName?: string;
};

export type MapProps = {
  hasActiveTowRequest: boolean;
  setHasActiveTowRequest: React.Dispatch<React.SetStateAction<boolean>>;
  motoristasPosition: GuinchosDto[];
  userPosition: Position | null;
  hoveredGuinchoId: string | null;
  mapRef: React.RefObject<L.Map | null>;
  setSelectedGuincho: React.Dispatch<React.SetStateAction<GuinchosDto | null>>;
  selectedGuincho: GuinchosDto | null;
  setPriceG: React.Dispatch<React.SetStateAction<number | null>>;
  setDistanceKmG: React.Dispatch<React.SetStateAction<number | null>>;
  setDurationMinG: React.Dispatch<React.SetStateAction<number | null>>;
  setRouteG: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  setRoute: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  setHoveredGuinchoId: React.Dispatch<React.SetStateAction<string | null>>;
  setRequestStatus: React.Dispatch<
    React.SetStateAction<
      | "idle"
      | "sending"
      | "waitingDriver"
      | "accepted"
      | "counterOfferReceived"
      | "counterOfferRejected"
      | "rejected"
      | "cancelled"
    >
  >;
  requestStatus: string;
  route: [number, number][] | null;
  routeG: [number, number][] | null;
  priceEstimate: number;
  distanceKm: number;
  duration: number;
  priceEstimateG: number | null;
  distanceKmG: number | null;
  durationMinG: number | null;
};

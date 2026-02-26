export type MotoristaDto = {
  userId: number;
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
  distanceKm: number;
};

export type Position = {
  lat: number;
  lon: number;
  name?: string;
};

export type UserDto = {
  userPosition: Position;
  userId?: number;
  userName?: string;
};

export type MapProps = {
  motoristasPosition: GuinchosDto[];
  userPosition: Position | null;
  hoveredGuinchoId: number | null;
  mapRef: React.RefObject<L.Map | null>;
  setSelectedGuincho: React.Dispatch<React.SetStateAction<GuinchosDto | null>>;
  selectedGuincho: GuinchosDto | null;
  setPriceG: React.Dispatch<React.SetStateAction<number | null>>;
  setDistanceKmG: React.Dispatch<React.SetStateAction<number | null>>;
  setDurationMinG: React.Dispatch<React.SetStateAction<number | null>>;
  setRouteG: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  setHoveredGuinchoId: React.Dispatch<React.SetStateAction<number | null>>;
  setRequestStatus: React.Dispatch<
    React.SetStateAction<"idle" | "sending" | "waitingDriver" | "accepted">
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

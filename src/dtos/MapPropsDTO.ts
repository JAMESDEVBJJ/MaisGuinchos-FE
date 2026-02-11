export type MotoristaDto = {
    "userId": number;
    "name": string;
    "arrivalTime"?: number;
    "lat": number;
    "lon": number;
}

export type GuinchosDto = {
    "motorista": MotoristaDto;
    "stars": number;
    "available": boolean;
    "color": string;
    "model": string;
    "distanceKm": number;
  }

export type Position = {
    lat: number;
    lon: number;
    name?: string;
}

export type UserDto = {
    userPosition: Position;
    userId?: number;
    userName?: string;
}

export type MapProps = {
    motoristasPosition: GuinchosDto[];
    userPosition: Position;
    hoveredGuinchoId: number | null;
    mapRef: React.RefObject<L.Map | null>;
}
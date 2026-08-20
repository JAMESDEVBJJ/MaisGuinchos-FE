import React, { useState } from "react";
import L from "leaflet";
import { useEffect } from "react";
import type { GuinchosDto, Position } from "../../dtos/MapPropsDTO";
import { useAuth } from "../../contexts/AuthContext";
import { ClientSideBar } from "./ClientSideBar";
import { DriverSideBar } from "./DriverSideBar";
import type { FiltroId } from "./Filtros";
import type { TowRequestStatus } from "../../utils/towsRequestsUtils";

export type SidebarProps = {
  locationText: string;
  hasActiveTowRequest: boolean;
  setHasActiveTowRequest: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  destinationText: string;
  setDestinationText: React.Dispatch<React.SetStateAction<string>>;
  buscarGuinchos: () => void;
  guinchos: GuinchosDto[];
  setGuinchos: React.Dispatch<React.SetStateAction<GuinchosDto[]>>;
  selectedGuincho: GuinchosDto | null;
  setSelectedGuincho: (g: GuinchosDto | null) => void;
  setHoveredGuinchoId: React.Dispatch<React.SetStateAction<string | null>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Position | null>>;
  userLocation: Position | null;
  handleUpdateDestination: () => Promise<void>;
  setRouteG: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  routeG: [number, number][] | null;
  setRoute: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  route: [number, number][] | null;
  mapRef: React.RefObject<L.Map | null>;
  loading: boolean;
  priceEstimate: number;
  distanceKm: number;
  duration: number;
  priceEstimateG: number | null;
  setPriceG: React.Dispatch<React.SetStateAction<number | null>>;
  distanceKmG: number | null;
  setDistanceKmG: React.Dispatch<React.SetStateAction<number | null>>;
  durationMinG: number | null;
  setDurationMinG: React.Dispatch<React.SetStateAction<number | null>>;
  destination: Position | null;
  durationMinTotal: number;
  setRequestStatus: React.Dispatch<
    React.SetStateAction<TowRequestStatus | null>
  >;
  requestStatus: TowRequestStatus | null;
  setActiveFilters: React.Dispatch<React.SetStateAction<FiltroId[]>>;
  activeFilters: FiltroId[];
};

export function Sidebar(props: SidebarProps) {
  const [hideDriverPhoto, setHideDriverPhoto] = useState(false);

  const { user } = useAuth();

  const [locationText, setLocationText] = useState("");

  const COMPACT_WIDTH = 350;

  const [sidebarW, setSideBarW] = useState(360);
  const [isResizing, setIsResizing] = useState(false);

  const [isCompact, setIsCompact] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  function handleMouseUp() {
    setIsResizing(false);
  }
  function mouseMove(e: MouseEvent) {
    if (!isResizing) return;

    const newWidth = e.clientX;
    if (newWidth <= 280) return;
    if (newWidth >= 580) return;

    if (props.selectedGuincho != null) {
      if (newWidth <= 350) setHideDriverPhoto(true);
      else setHideDriverPhoto(false);
    }

    setSideBarW(newWidth);
    setIsCompact(newWidth <= COMPACT_WIDTH);
  }

  return user?.isDriver ? (
    <DriverSideBar
      locationText={locationText}
      setLocationText={setLocationText}
      setUserLocation={props.setUserLocation}
      setRouteG={props.setRouteG}
      setRoute={props.setRoute}
      sideBarW={sidebarW}
      setIsResizing={setIsResizing}
      mapRef={props.mapRef}
    />
  ) : user?.isClient ? (
    <ClientSideBar
      {...props}
      sidebarW={sidebarW}
      isCompact={isCompact}
      setIsResizing={setIsResizing}
      hideDriverPhoto={hideDriverPhoto}
    />
  ) : (
    <></>
  );
}

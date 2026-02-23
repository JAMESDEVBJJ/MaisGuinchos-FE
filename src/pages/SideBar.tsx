import React, { useState } from "react";
import L from "leaflet";
import { useEffect } from "react";
import type { GuinchosDto, Position } from "../dtos/MapPropsDTO";
import { api } from "../services/api";
import iconLocation from "../assets/icons/location.png";
import * as signalR from "@microsoft/signalr";
import type { TowRequestReceiveDto } from "../dtos/TowRequestReceiveDTO";
import { useAuth } from "../contexts/AuthContext";
import { ClientSideBar } from "./ClientSideBar";

type SidebarProps = {
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  destinationText: string;
  setDestinationText: React.Dispatch<React.SetStateAction<string>>;
  buscarGuinchos: () => void;
  guinchos: GuinchosDto[];
  selectedGuincho: GuinchosDto | null;
  setSelectedGuincho: (g: GuinchosDto | null) => void;
  setHoveredGuinchoId: React.Dispatch<React.SetStateAction<number | null>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Position | null>>;
  userLocation: Position | null;
  handleUpdateDestination: () => Promise<void>;
  setRouteG: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  routeG: [number, number][] | null;
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
};

export function Sidebar(props: SidebarProps) {
  const { user } = useAuth();

  const token = localStorage.getItem("token");

  const [locationText, setLocationText] = useState("");

  const COMPACT_WIDTH = 350;

  const [sidebarW, setSideBarW] = useState(360);
  const [isResizing, setIsResizing] = useState(false);

  const [towReceive, setTowReceive] = useState<TowRequestReceiveDto | null>(
    null
  );

  const [towReceived, setTowReceived] = useState<boolean>(false);

  const [isCompact, setIsCompact] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7120/towhub", {
        accessTokenFactory: () => token!,
      })
      .withAutomaticReconnect()
      .build();

    async function startConnection() {
      try {
        await connection.start();
        console.log("Conectado ao TowHub");
      } catch (err) {
        console.error("Erro ao conectar:", err);
      }
    }
    startConnection();

    connection.on("ReceiveTowRequest", (data) => {
      console.dir(data);
      setTowReceive(data);
      setTowReceived(true);
    });

    return () => {
      connection.stop();
    };
  }, [token]);

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  async function handleUpdateLocation() {
    if (!locationText.trim()) {
      return;
    }

    const response = await api.post("/user/location", {
      address: locationText,
    });

    const { lat, lon } = response.data;

    const latN = Number(lat);
    const lonN = Number(lon);

    if (isNaN(latN) || isNaN(lonN)) {
      console.error("Latitude ou longitude inválidas", lat, lon);
      return;
    }

    props.setRouteG(null);
    props.setUserLocation({ lat: latN, lon: lonN });
  }

  function handleMouseDown() {
    setIsResizing(true);
  }

  function handleMouseUp() {
    setIsResizing(false);
  }
  function mouseMove(e: MouseEvent) {
    if (!isResizing) return;

    const newWidth = e.clientX;

    if (newWidth <= 280) return;
    if (newWidth >= 580) return;

    setSideBarW(newWidth);
    setIsCompact(newWidth <= COMPACT_WIDTH);
  }

  return user?.isDriver ? (
    <aside className="sidebar" style={{ width: sidebarW }}>
      {props.selectedGuincho == null && (
        <div className="sidebar-1">
          <div className="search">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Setar localização"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateLocation();
                  }
                }}
              />
              <img src={iconLocation} className="input-icon" />
            </div>
          </div>

          {towReceived && <div>{towReceive?.suggestedPrice}</div>}
        </div>
      )}

      <div className="resize-handle" onMouseDown={handleMouseDown} />
    </aside>
  ) : (
    <ClientSideBar {...props} sidebarW={sidebarW} isCompact={isCompact} setIsResizing={setIsResizing}/>
  );
}

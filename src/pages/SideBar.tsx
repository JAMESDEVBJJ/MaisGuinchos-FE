import React, { useRef, useState } from "react";
import L from "leaflet";
import { useEffect } from "react";
import type { GuinchosDto, Position } from "../dtos/MapPropsDTO";
import { api } from "../services/api";
import iconLocation from "../assets/icons/location.png";
import iconDestination from "../assets/icons/detinIcon.png";
import defaultUserPng from "../assets/defaultUser.png";
import GuinchosResults from "./GuinchosResults";
import * as signalR from "@microsoft/signalr";
import type { TowRequestReceiveDto } from "../dtos/TowRequestReceiveDTO";

interface CoordinateDto {
  lat: number;
  lon: number;
}

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
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "sending" | "waitingDriver" | "accepted"
  >("idle");

  const token = localStorage.getItem("token");

  const serviceIsDisabled = !props.routeG || !props.route;

  const [locationText, setLocationText] = useState("");

  const routeLayerRef = useRef<L.Layer | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  const foto = props.selectedGuincho?.motorista?.foto;
  const isDefault = !foto || foto.trim() === "";

  const COMPACT_WIDTH = 350;

  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [sidebarW, setSideBarW] = useState(360);
  const [isResizing, setIsResizing] = useState(false);

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleIssue, setVehicleIssue] = useState("");
  const [notes, setNotes] = useState("");

  const [towRequestId, setTowRequestId] = useState<string | null>(null);
  const [towReceive, setTowReceive] = useState<TowRequestReceiveDto | null>(
    null
  );

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

  function handleBackToList() {
    if (routeLayerRef.current) {
      const map = props.mapRef.current;
      if (map) {
        map.removeLayer(routeLayerRef.current);
      }
      routeLayerRef.current = null;
    }

    props.setPriceG(null);
    props.setDistanceKmG(null);
    props.setDurationMinG(null);
    props.setRouteG(null);
    props.setHoveredGuinchoId(null);
    props.setSelectedGuincho(null);
    props.setDistanceKmG(null);
    props.setDurationMinG(null);
    setRequestStatus("idle");
  }

  async function calcularRotaComGuincho() {
    if (!props.selectedGuincho) return;

    const origemLat = props.selectedGuincho.motorista.lat;
    const origemLon = props.selectedGuincho.motorista.lon;

    const destino = props.userLocation;

    const response = await api.post("/maps/route/calculate/driver", {
      originLat: origemLat,
      originLon: origemLon,
      driverLat: destino?.lat,
      driverLon: destino?.lon,
    });

    const route = response.data;

    const routePositions = route.polyline.map((p: CoordinateDto) => [
      p.lat,
      p.lon,
    ]);

    props.setRouteG(routePositions);
    props.setDistanceKmG(route.distanceKm);
    props.setDurationMinG(route.durationMinutes);
    props.setPriceG(route.priceEstimate);

    const map = props.mapRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    const poly = L.polyline(routePositions, { weight: 4, opacity: 0.6 });

    map.fitBounds(poly.getBounds(), { padding: [60, 60] });
    console.dir(props.route);
  }

  async function handleTowRequest() {
    if (!props.selectedGuincho) {
      alert("Selecione um motorista primeiro.");
      return;
    }

    if (!props.userLocation || !props.destination) {
      alert("Localização inválida.");
      return;
    }

    try {
      const response = await api.post("/towrequests", {
        driverId: props.selectedGuincho.motorista.userId,

        pickupLat: props.userLocation.lat,
        pickupLon: props.userLocation.lon,

        dropoffLat: props.destination.lat,
        dropoffLon: props.destination.lon,

        totalDistanceKm: props.distanceKm,
        durationMinutes: props.durationMinTotal,

        suggestedPrice: props.priceEstimate,

        vehicleType: vehicleType,
        vehicleIssue: vehicleIssue,
        notes: notes,
      });

      setRequestStatus("waitingDriver");
      setTowRequestId(response.data.id);
    } catch (error) {
      console.error(error);
      alert("Erro ao solicitar guincho.");
    }
  }

  return (
    <>
      <aside className="sidebar" style={{ width: sidebarW }}>
        {(props.selectedGuincho == null && (
          <div className="sidebar-1">
            {" "}
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

              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Setar destino"
                  value={props.destinationText}
                  onChange={(e) => props.setDestinationText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      props.handleUpdateDestination();
                    }
                  }}
                />
                <img src={iconDestination} className="input-icon" />
              </div>

              <button onClick={props.buscarGuinchos}>Buscar guinchos</button>
            </div>
            {props.loading && (
              <>
                <h1>LOADING...</h1>
              </>
            )}
            {!props.loading && props.guinchos.length === 0 && (
              <div className="empty-state">
                <p>Digite sua localização e procure por guinchos.</p>
              </div>
            )}
            {!props.loading && props.guinchos.length >= 1 && (
              <GuinchosResults
                isCompact={isCompact}
                guinchos={props.guinchos}
                setHovered={props.setHoveredGuinchoId}
                mapRef={props.mapRef}
                setSelectedGuincho={props.setSelectedGuincho}
              ></GuinchosResults>
            )}
          </div>
        )) || (
          <div className="detail">
            <button className="back" onClick={handleBackToList}>
              ⬅
            </button>
            <div className="detail-top">
              <img
                className={`detail-photo ${isDefault ? "default-photo" : ""}`}
                src={
                  isDefault ? defaultUserPng : `https://localhost:7120${foto}`
                }
                alt={props.selectedGuincho?.motorista?.name}
              />
              <div className="detail-info">
                <h3>{props.selectedGuincho?.motorista.name}</h3>
                <div className="rating-row">
                  {renderStars(props.selectedGuincho?.stars)}{" "}
                  <span className="rating-number">
                    {props.selectedGuincho?.stars.toFixed(1)}
                  </span>
                </div>
                <div className="driver-data">
                  <span className="phone">
                    {props.selectedGuincho?.motorista.number}
                  </span>
                  <div>Modelo: {props.selectedGuincho?.model}</div>
                  <div>Placa: {props.selectedGuincho?.motorista.placa}</div>
                  <div>Cor: {props.selectedGuincho?.color}</div>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="primary fullwidth"
                onClick={calcularRotaComGuincho}
              >
                Calcular rota com guincho
              </button>
            </div>
            {props.distanceKmG &&
              props.durationMinG &&
              props.priceEstimateG &&
              props.routeG && (
                <div className="route-summary">
                  <ul>
                    <li>
                      <strong>Distância total:</strong>{" "}
                      {(props.distanceKm + props.distanceKmG).toFixed(1)} Km
                    </li>

                    <li>
                      <strong>Tempo médio:</strong>{" "}
                      {((props.duration + props.durationMinG) / 60).toFixed(1)}{" "}
                      h
                    </li>

                    {!showDetails && (
                      <li>
                        <strong>Preço estimado:</strong> $
                        {(props.priceEstimate + props.priceEstimateG).toFixed(
                          0
                        )}
                      </li>
                    )}
                  </ul>
                  {showDetails && (
                    <div className="route-breakdown">
                      <p>
                        <strong>
                          Guincho <span className="arrow yellow">→</span> Você:
                        </strong>{" "}
                        {props.priceEstimateG.toFixed(0)}R${" "}
                        {props.distanceKmG.toFixed(0)}km
                      </p>
                      <p>
                        <strong>
                          Você <span className="arrow orange">→</span> Destino:
                        </strong>{" "}
                        {props.priceEstimate.toFixed(0)}R${" "}
                        {props.distanceKm.toFixed(0)}km
                      </p>
                    </div>
                  )}
                  <span
                    className="more-details"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "Menos detalhes" : "Mais detalhes"}
                  </span>
                </div>
              )}
            <button
              className={`secondary fullwidth ${
                requestStatus === "waitingDriver"
                  ? "waiting"
                  : props.routeG && props.route
                  ? "contact-enabled"
                  : ""
              }`}
              disabled={serviceIsDisabled || requestStatus === "waitingDriver"}
              onClick={handleTowRequest}
            >
              {requestStatus === "waitingDriver"
                ? "Aguardando motorista..."
                : requestStatus === "sending"
                ? "Enviando..."
                : "Solicitar Guincho"}
            </button>
          </div>
        )}
        <div className="resize-handle" onMouseDown={handleMouseDown} />
      </aside>
    </>
  );
}

function renderStars(n?: number) {
  const stars = Math.round((n ?? 0) * 2) / 2;
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  const arr = [];
  for (let i = 0; i < full; i++) arr.push("★");
  if (half) arr.push("☆");
  while (arr.length < 5) arr.push("✩");
  return <span className="stars">{arr.join(" ")}</span>;
}

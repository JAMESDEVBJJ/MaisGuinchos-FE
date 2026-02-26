import { useEffect, useRef, useState } from "react";
import iconDestination from "../../assets/icons/detinIcon.png";
import GuinchosResults from "../GuinchosResults";
import { api } from "../../services/api";
import L from "leaflet";
import defaultUserPng from "../../assets/defaultUser.png";
import type { GuinchosDto, Position } from "../../dtos/MapPropsDTO";
import { InputLocation } from "./InputLocation";

interface CoordinateDto {
  lat: number;
  lon: number;
}

type ClientBarProps = {
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  destinationText: string;
  setDestinationText: React.Dispatch<React.SetStateAction<string>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Position | null>>;
  buscarGuinchos: () => void;
  guinchos: GuinchosDto[];
  selectedGuincho: GuinchosDto | null;
  setSelectedGuincho: (g: GuinchosDto | null) => void;
  setHoveredGuinchoId: React.Dispatch<React.SetStateAction<number | null>>;
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
  isCompact: boolean;
  sidebarW: number;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestStatus: React.Dispatch<
    React.SetStateAction<"idle" | "sending" | "waitingDriver" | "accepted">
  >;
  requestStatus: string;
};
export function ClientSideBar(props: ClientBarProps) {
  const [showDetails, setShowDetails] = useState(false);

  const routeLayerRef = useRef<L.Layer | null>(null);

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleIssue, setVehicleIssue] = useState("");
  const [notes, setNotes] = useState("");

  const [towRequestId, setTowRequestId] = useState<string | null>(null);

  const foto = props.selectedGuincho?.motorista?.foto;
  const isDefault = !foto || foto.trim() === "";

  const serviceIsDisabled = !props.routeG || !props.route;

  const [dots, setDots] = useState("");

  useEffect(() => {
    if (props.requestStatus !== "waitingDriver") {
      setDots("");
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [props.requestStatus]);

  function handleMouseDown() {
    props.setIsResizing(true);
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
    props.setRequestStatus("idle");
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

      props.setRequestStatus("waitingDriver");
      setTowRequestId(response.data.id);
    } catch (error) {
      console.error(error);
      alert("Erro ao solicitar guincho.");
    }
  }

  return (
    <aside className="sidebar" style={{ width: props.sidebarW }}>
      {props.selectedGuincho == null ? (
        <>
          {props.selectedGuincho == null && (
            <div className="sidebar-1">
              <div className="search">
                <InputLocation
                  locationText={props.locationText}
                  setLocationText={props.setLocationText}
                  setRouteG={props.setRouteG}
                  setUserLocation={props.setUserLocation}
                />
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
            </div>
          )}
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
              isCompact={props.isCompact}
              guinchos={props.guinchos}
              setHovered={props.setHoveredGuinchoId}
              mapRef={props.mapRef}
              setSelectedGuincho={props.setSelectedGuincho}
            ></GuinchosResults>
          )}
        </>
      ) : (
        <>
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
                props.requestStatus === "waitingDriver"
                  ? "waiting"
                  : props.routeG && props.route
                  ? "contact-enabled"
                  : ""
              }`}
              disabled={serviceIsDisabled || props.requestStatus === "waitingDriver"}
              onClick={handleTowRequest}
            >
              {props.requestStatus === "waitingDriver"
                ? `Aguardando motorista${dots}`
                : props.requestStatus === "sending"
                ? "Enviando..."
                : "Solicitar Guincho"}
            </button>
          </div>
        </>
      )}
      <div className="resize-handle" onMouseDown={handleMouseDown} />
    </aside>
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

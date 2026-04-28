import { useEffect, useRef, useState } from "react";
import iconDestination from "../../assets/icons/detinIcon.png";
import GuinchosResults from "./GuinchosResults";
import { api } from "../../services/api";
import L from "leaflet";
import defaultUserPng from "../../assets/defaultUser.png";
import type { GuinchosDto, Position } from "../../dtos/MapPropsDTO";
import type { PutTowCounterOfferDTO } from "../../dtos/CounterOfferDTO";
import { InputLocation } from "./InputLocation";
import * as signalR from "@microsoft/signalr";
import { TowRequestData } from "./TowRequestData";
import ReceiveCounterTowModal from "./ReceiveCounterTowModal";
import { useTowTravel } from "../../contexts/TowTravelContext";
import type { AcceptTowRequestResponseDTO } from "../../dtos/AcceptTowRequestResponseDTO";
import { TowTravelStatus } from "../../utils/enums/TowTravelStatus";
import type { RouteRealtimeDTO } from "../../dtos/RouteRealtimeDTO";
import iconGuincho from "../../assets/icons/guinchoMarkup.png";
import type { TowTravelDTO } from "../../dtos/TowTravelDTO";

interface CoordinateDto {
  lat: number;
  lon: number;
}

interface CreateTowRequestDTO {
  id?: string;
  clientId?: string;
  clientName?: string;
  driverId?: string;
  driverName?: string;
  counterOfferPrice?: number;
  counterReason?: string;
  counterOfferPercent?: number;
  counterOfferAt?: number;
  status?: number;
  createdAt?: number;
  pickupLat: number;
  pickupLon: number;
  dropoffLat: number;
  dropoffLon: number;
  totalDistanceKm: number;
  distanceToPickupKm: number;
  distanceToDestinationKm: number;
  durationMinutes: number;
  durationToPickupMin: number;
  durationToDestinationMin: number;
  suggestedPrice: number;
  vehicleType: string;
  vehicleIssue: string;
  notes?: string;
}

type ClientBarProps = {
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  destinationText: string;
  setDestinationText: React.Dispatch<React.SetStateAction<string>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Position | null>>;
  buscarGuinchos: () => void;
  guinchos: GuinchosDto[];
  setGuinchos: React.Dispatch<React.SetStateAction<GuinchosDto[]>>;
  selectedGuincho: GuinchosDto | null;
  setSelectedGuincho: (g: GuinchosDto | null) => void;
  setHoveredGuinchoId: React.Dispatch<React.SetStateAction<string | null>>;
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
    React.SetStateAction<
      | "idle"
      | "sending"
      | "waitingDriver"
      | "accepted"
      | "counterOfferReceived"
      | "counterOfferRejected"
    >
  >;
  requestStatus: string;
  hideDriverPhoto: boolean;
};
export function ClientSideBar(props: ClientBarProps) {
  const token = localStorage.getItem("token");

  const distanceRouteTotal =
    props.distanceKm + (props.distanceKmG ? props.distanceKmG : 0);

  const [showDetails, setShowDetails] = useState(false);

  const routeLayerRef = useRef<L.Layer | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleIssue, setVehicleIssue] = useState("");
  const [notes, setNotes] = useState("");

  const [towRequest, setTowRequest] = useState<PutTowCounterOfferDTO | null>(
    null
  );

  const [counterOffer, setCounterOffer] =
    useState<PutTowCounterOfferDTO | null>(null);

  const [showGetCounterModal, setShowGetCounterModal] = useState(false);

  const {
    towTravel,
    setTowTravel,
    clearTowTravel,
    setTowTravelStatus,
    towTravelStatus,
  } = useTowTravel();

  const foto = props.selectedGuincho?.motorista?.foto;
  const isDefault = !foto || foto.trim() === "";

  const serviceIsDisabled =
    !props.routeG ||
    !props.route ||
    props.requestStatus === "waitingDriver" ||
    props.requestStatus === "counterOfferRejected" ||
    props.requestStatus === "accepted";

  const [dots, setDots] = useState("");

  const driverMarkerRef = useRef<L.Marker | null>(null);

  const guinchoIcon = new L.Icon({
    iconUrl: iconGuincho,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

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
        console.log("Conectado ao TowHub como cliente");
      } catch (err) {
        console.error("Erro ao conectar:", err);
      }
    }
    startConnection();

    connection.on("GuinchoStatusUpdated", (data) => {
      props.setGuinchos((prev) =>
        prev.map((g) => {
          if (g.motorista.userId === data.motoristaId) {
            return { ...g, available: data.disponivel };
          }
          return g;
        })
      );
    });

    connection.on("TowRequestAccepted", (data: AcceptTowRequestResponseDTO) => {
      props.setRequestStatus("accepted");

      const towTravel: TowTravelDTO = {
        towRequestId: data.towRequestId,
        id: data.towTravelId,
        driverId: data.towDriverId,
        finalPrice: data.finalPrice,

        distanceToPickupKm: data.distanceToPickupKm,
        timeToPickupMin: data.durationMinToPickup,

        distanceToDestinationKm: data.distanceToDestinationKm,
        timeToDestinationMin: data.durationMinToDestination,
        status: 0,
      };

      console.dir(towTravel);

      setTowTravel(towTravel);
      setTowTravelStatus(TowTravelStatus.GoingToClient);

      const maps = props.mapRef.current;
      if (!maps) return;
      if (!driverMarkerRef.current) {
        driverMarkerRef.current = L.marker(
          [data.driverLat, data.driverLon] as [number, number],
          {
            icon: guinchoIcon,
          }
        ).addTo(maps);
      } else {
        driverMarkerRef.current.setLatLng([data.driverLat, data.driverLon] as [
          number,
          number
        ]);
      }
    });

    connection.on("ReceiveCounterOffer", (data: PutTowCounterOfferDTO) => {
      props.setRequestStatus("counterOfferReceived");

      setTowRequest(data);
    });

    connection.on("DriverLocationUpdated", (data: RouteRealtimeDTO) => {
      const route = data.polyline.map(
        (c) => [c.lat, c.lon] as [number, number]
      );

      const towTravel = {
        estimatedArrivalTime: data.durationMinutes,
        distanceKm: data.distanceKm,
      };

      console.dir(towTravel);
      console.log("ué");
      setTowTravel((prev) => {
        if (!prev) {
          return null;
        }
        return {
          ...prev,
          estimatedArrivalTime: data.durationMinutes,
          distanceKm: data.distanceKm,
        };
      });

      if (data.type === 0) {
        const maps = props.mapRef.current;
        if (!maps) return;

        const newLatLng: [number, number] = [data.origin.lat, data.origin.lon];

        if (!driverMarkerRef.current) {
          driverMarkerRef.current = L.marker(newLatLng, {
            icon: guinchoIcon,
          }).addTo(maps);
        } else {
          driverMarkerRef.current.setLatLng(newLatLng);
        }

        props.setRouteG(route);
      } else {
        console.log("nn é to pickup");
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    if (props.requestStatus !== "waitingDriver") {
      if (props.requestStatus !== "counterOfferRejected") {
        setDots("");
        return;
      }
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
      destinationLat: destino?.lat,
      destinationLon: destino?.lon,
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

    map.flyToBounds(poly.getBounds(), {
      padding: [60, 60],
      duration: 0.5,
    });
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

    clearTowTravel();
    props.setPriceG(null);
    props.setDistanceKmG(null);
    props.setDurationMinG(null);
    props.setRouteG(null);
    props.setHoveredGuinchoId(null);
    props.setSelectedGuincho(null);
    props.setDistanceKmG(null);
    props.setDurationMinG(null);
    props.setRequestStatus("idle");
    setShowGetCounterModal(false);
  }

  async function handleConfirmSend() {
    if (!props.selectedGuincho) {
      alert("Selecione um motorista primeiro.");
      return;
    }

    if (!props.userLocation || !props.destination) {
      alert("Localização inválida.");
      return;
    }

    if (!vehicleType || !vehicleIssue) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    if (!props.distanceKmG || !props.durationMinG) {
      alert("Dados da rota do até o usuário inválidos.");
      return;
    }

    const towRequestDto: CreateTowRequestDTO = {
      driverId: props.selectedGuincho.motorista.userId,

      pickupLat: props.userLocation.lat,
      pickupLon: props.userLocation.lon,

      dropoffLat: props.destination.lat,
      dropoffLon: props.destination.lon,

      totalDistanceKm: distanceRouteTotal,
      distanceToPickupKm: props.distanceKmG,
      distanceToDestinationKm: props.distanceKm,

      durationMinutes: props.durationMinTotal,
      durationToPickupMin: props.durationMinG,
      durationToDestinationMin: props.duration,

      suggestedPrice: props.priceEstimate,

      vehicleType: vehicleType,
      vehicleIssue: vehicleIssue,
      notes: notes,
    };

    try {
      const response = await api.post("/towrequests", towRequestDto);

      props.setRequestStatus("waitingDriver");

      setShowModal(false);

      setVehicleType("");
      setVehicleIssue("");
      setNotes("");
    } catch (error) {
      console.error(error);
      alert("Erro ao solicitar guincho.");
    }
  }

  const buttonCounterAndSubmitText = () => {
    switch (props.requestStatus) {
      case "waitingDriver":
        return `Aguardando motorista${dots}`;
      case "sending":
        return "Enviando...";
      case "counterOfferReceived":
        return "Contraproposta recebida!";
      case "counterOfferRejected":
        return `Aguardando motorista${dots}`;
      case "accepted":
        return "Solitação aceita!";
      default:
        return "Solicitar Guincho";
    }
  };

  const buttonCounterClass = () => {
    if (
      props.requestStatus === "waitingDriver" ||
      props.requestStatus === "counterOfferRejected"
    )
      return "secondary fullwidth waiting";

    if (props.requestStatus === "counterOfferReceived")
      return "secondary fullwidth contact-enabled ";

    if (props.requestStatus === "accepted") {
      return "secondary contact-enabled accepted fullwidth";
    }

    if (props.routeG && props.route)
      return "secondary fullwidth contact-enabled";

    return "secondary fullwidth";
  };

  return (
    <>
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

                  <button onClick={props.buscarGuinchos}>
                    Buscar guinchos
                  </button>
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
              {(!towTravel ||
                towTravelStatus === TowTravelStatus.Cancelled ||
                towTravelStatus === TowTravelStatus.Finished) && (
                <button className="back" onClick={handleBackToList}>
                  ⬅
                </button>
              )}
              <div className="detail-top">
                <img
                  className={`detail-photo ${
                    isDefault ? "default-photo" : ""
                  } ${props.hideDriverPhoto ? "hide" : ""}`}
                  src={
                    isDefault ? defaultUserPng : `https://localhost:7120${foto}`
                  }
                  alt={props.selectedGuincho?.motorista?.name}
                />

                <div className="detail-info">
                  {towTravelStatus === TowTravelStatus.GoingToClient ? (
                    <h3>
                      {props.selectedGuincho?.motorista.name} está indo até
                      você.
                    </h3>
                  ) : towTravelStatus === TowTravelStatus.Arrived ? (
                    <h3>
                      {props.selectedGuincho?.motorista.name} chegou até você.
                    </h3>
                  ) : towTravelStatus === TowTravelStatus.InProgress ? (
                    <h3>
                      {props.selectedGuincho?.motorista.name} está indo até o
                      destino.
                    </h3>
                  ) : (
                    <h3>{props.selectedGuincho?.motorista.name}</h3>
                  )}

                  {!towTravel && (
                    <div className="rating-row">
                      {renderStars(props.selectedGuincho?.stars)}{" "}
                      <span className="rating-number">
                        {props.selectedGuincho?.stars.toFixed(1)}
                      </span>
                    </div>
                  )}

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
                {!towTravel && (
                  <button
                    className="primary fullwidth"
                    onClick={calcularRotaComGuincho}
                  >
                    Calcular rota com guincho
                  </button>
                )}
              </div>
              {props.routeG &&
                props.distanceKmG != null &&
                props.durationMinG != null &&
                props.priceEstimateG != null && (
                  <TowRequestData
                    distanceKm={props.distanceKm}
                    durationMin={props.durationMinTotal}
                    priceEstimate={props.priceEstimate}
                    distanceKmG={props.distanceKmG}
                    durationMinG={props.durationMinG}
                    priceEstimateG={props.priceEstimateG}
                    suggestedPrice={null}
                    routeG={props.routeG}
                    modelo={null}
                    totalDistanceKm={null}
                  />
                )}
              <button
                className={buttonCounterClass()}
                disabled={serviceIsDisabled}
                onClick={
                  props.requestStatus === "counterOfferReceived"
                    ? () => setShowGetCounterModal(true)
                    : () => setShowModal(true)
                }
              >
                {buttonCounterAndSubmitText()}
              </button>
            </div>
          </>
        )}
        <div className="resize-handle" onMouseDown={handleMouseDown} />
      </aside>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close" onClick={() => setShowModal(false)}>
              ✕
            </button>

            <h2>Complementar Solicitação</h2>

            <div className="field">
              <span>Tipo do veículo:</span>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
            </div>

            <div className="field">
              <span>Questão do veículo:</span>
              <input
                type="text"
                value={vehicleIssue}
                onChange={(e) => setVehicleIssue(e.target.value)}
              />
            </div>

            <div className="field">
              <span>Notas:</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              className={`secondary fullwidth ${
                props.requestStatus === "waitingDriver"
                  ? "waiting"
                  : props.routeG && props.route
                  ? "contact-enabled"
                  : ""
              }`}
              disabled={
                serviceIsDisabled || props.requestStatus === "waitingDriver"
              }
              onClick={handleConfirmSend}
            >
              {props.requestStatus === "waitingDriver" ||
              props.requestStatus === "counterOfferRejected"
                ? `Aguardando motorista${dots}`
                : props.requestStatus === "counterOfferReceived"
                ? "Contraproposta recebida!"
                : props.requestStatus === "sending"
                ? "Enviando..."
                : "Solicitar Guincho"}
            </button>
          </div>
        </div>
      )}
      {showGetCounterModal && props.requestStatus !== "accepted" && (
        <ReceiveCounterTowModal
          onClose={() => setShowGetCounterModal(false)}
          towCounterReceived={towRequest}
          setShowGetCounterModal={setShowGetCounterModal}
          setRequestStatus={props.setRequestStatus}
        />
      )}
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

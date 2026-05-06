import { useState, useEffect, useRef } from "react";
import { InputLocation } from "./InputLocation";
import type { Position } from "../../dtos/MapPropsDTO";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import * as signalR from "@microsoft/signalr";
import { api } from "../../services/api";
import { TowRequestData } from "./TowRequestData";
import CounterOfferModal from "./CounterTowModal";
import type { AcceptTowRequestResponseDTO } from "../../dtos/AcceptTowRequestResponseDTO";
import L from "leaflet";
import iconClient from "../../assets/icons/iconUser.png";
import { TowTravelStatus } from "../../utils/enums/TowTravelStatus";
import { useTowTravel } from "../../contexts/TowTravelContext";
import type { TowTravelDTO } from "../../dtos/TowTravelDTO";
import { RouteType, type RouteRealtimeDTO } from "../../dtos/RouteRealtimeDTO";
import iconGuincho from "../../assets/icons/guinchoMarkup.png";

type DriverSideProps = {
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Position | null>>;
  setRouteG: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  setRoute: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  sideBarW: number;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
  mapRef: React.RefObject<L.Map | null>;
};

export function DriverSideBar(props: DriverSideProps) {
  const token = localStorage.getItem("token");

  const [towsReceive, setTowsReceive] = useState<TowRequestReceiveDto[]>([]);

  const [towReceived, setTowReceived] = useState<boolean>(false);

  const [isAvailable, setIsAvailable] = useState(false);

  const [showCounterModal, setShowCounterModal] = useState(false);

  const [selectedTow, setSelectedTow] = useState<TowRequestReceiveDto | null>(
    null
  );

  const { setTowTravel, towTravel, setTowTravelStatus } = useTowTravel();

  const driverMarkerRef = useRef<L.Marker | null>(null);

  const guinchoIcon = new L.Icon({
    iconUrl: iconGuincho,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const userIcon = new L.Icon({
    iconUrl: iconClient,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const handleToggle = async () => {
    try {
      const newStatus = !isAvailable;

      await api.put("/guincho/status", {
        status: newStatus,
      });

      setIsAvailable(newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  function handleMouseDown() {
    props.setIsResizing(true);
  }

  const handleNewTow = (novoTow: TowRequestReceiveDto) => {
    setTowsReceive((prev) => {
      const filtradas = prev.filter((tow) => tow.clientId !== novoTow.clientId);
      console.dir(filtradas);
      return [novoTow, ...filtradas];
    });
  };

  useEffect(() => {
    if (!token) return;

    async function getPendingTows() {
      try {
        const response = await api.get("/towRequests/pendings");

        const towsData = response.data;

        setTowsReceive(towsData);
        setTowReceived(towsData?.length > 0);
      } catch (error) {
        console.error("Erro ao buscar pendências:", error);
        setTowsReceive([]);
        setTowReceived(false);
      }
    }

    getPendingTows();
  }, []);

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
      handleNewTow(data);
      setTowReceived(true);
    });

    connection.on("CounterOfferRejected", (data: TowRequestReceiveDto) => {
      setTowsReceive((prev) =>
        prev.map((t) =>
          t.id === data.id ? { ...t, counterOfferRecused: true } : t
        )
      );
      setSelectedTow((prev) => {
        if (!prev || prev.id !== data.id) return prev;
        return { ...prev, counterOfferRecused: true };
      });
    });

    connection.on(
      "CounterOfferAccepted",
      (data: AcceptTowRequestResponseDTO) => {
        const towTravel: TowTravelDTO = {
          towRequestId: data.towRequestId,
          id: data.towTravelId,
          driverId: data.towDriverId,
          finalPrice: data.finalPrice,
          timeToDestinationMin: data.durationMinToDestination,
          timeToPickupMin: data.durationMinToPickup,
          distanceToDestinationKm: data.distanceToDestinationKm,
          distanceToPickupKm: data.distanceToPickupKm,
          status: 0,
          origin: {latitude: data.driverLat, longitude: data.driverLon},
          destination: {latitude: data.destinationLat, longitude: data.destinationLon},
          pickup: {latitude: data.pickupLat, longitude: data.pickupLon}  
        };

        setSelectedTow((prev) => {
          if (!prev || prev.id !== data.towRequestId) return prev;

          return { ...prev, status: 4 };
        });
        setTowsReceive((prev) =>
          prev.map((p) =>
            p.id === data.towRequestId ? { ...p, status: 4 } : p
          )
        );

        console.dir(data);

        setTowTravel(towTravel);
        setTowTravelStatus(TowTravelStatus.GoingToClient);

        calcularRotaTowTravel(data);
      }
    );

    connection.on("DriverLocationUpdated", (data: RouteRealtimeDTO) => {
      const route = data.polyline.map(
        (c) => [c.lat, c.lon] as [number, number]
      );

      if (data.type === RouteType.DriverToPickup) {
        setTowTravel((prev) => {
          if (!prev) {
            return null;
          }
          return {
            ...prev,
            distanceToPickupKm: data.distanceKm,
            timeToPickupMin: data.durationMinutes,
          };
        });

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
        setTowTravel((prev) => {
          if (!prev) {
            return null;
          }
          return {
            ...prev,
            distanceToDestinationKm: data.distanceKm,
            timeToDestinationMin: data.durationMinutes,
          };
        });
        console.log("nn é to pickup");
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  const buttonCounterClass = () => {
    if (selectedTow?.counterOfferRecused) return "secondary fullwidth disabled";

    return `counter-btn sendButton  fullwidth  ${
      selectedTow?.status === 2 && "success"
    }`;
  };

  async function acceptTowRequest() {
    if (selectedTow) {
      const response = await api.post(
        `towrequests/${selectedTow.id}/accept-tow`
      );

      const data: AcceptTowRequestResponseDTO = response.data;

      const towTravel: TowTravelDTO = {
        towRequestId: data.towRequestId,
        id: data.towTravelId,
        driverId: data.towDriverId,
        finalPrice: data.finalPrice,
        timeToDestinationMin: data.durationMinToDestination,
        timeToPickupMin: data.durationMinToPickup,
        distanceToDestinationKm: data.distanceToDestinationKm,
        distanceToPickupKm: data.distanceToPickupKm,
        status: 0,
        origin: {latitude: data.driverLat, longitude: data.driverLon},
        destination: {latitude: data.destinationLat, longitude: data.destinationLon},
        pickup: {latitude: data.pickupLat, longitude: data.pickupLon}  
      };

      console.dir(data);

      setSelectedTow((prev) => {
        if (!prev || prev.id !== response.data.towRequestId) return prev;

        return { ...prev, status: 4 };
      });
      setTowsReceive((prev) =>
        prev.map((p) =>
          p.id === response.data.towRequestId ? { ...p, status: 4 } : p
        )
      );

      setTowTravel(towTravel);

      calcularRotaTowTravel(data);
    }
  }

  async function calcularRotaDestino(origin: Position, destination: Position) {
    const response = await api.post("/maps/route/calculate", {
      originLat: origin.lat,
      originLon: origin.lon,
      destinationLat: destination.lat,
      destinationLon: destination.lon,
    });

    console.dir({
      originLat: origin.lat,
      originLon: origin.lon,
      destLat: destination.lat,
      destLon: destination.lon,
    });

    const route = response.data;

    const routePositions = route.polyline.map((p: any) => [p.lat, p.lon]);

    props.setRoute(routePositions);

    const maps = props.mapRef.current;

    if (!maps) return;

    console.log("tem maps ref");
    const poly = L.polyline(routePositions, { weight: 4, opacity: 0.6 });
    maps.fitBounds(poly.getBounds(), { padding: [60, 60] });
  }

  async function calcularRotaTowTravel(towData: AcceptTowRequestResponseDTO) {
    const maps = props.mapRef.current;
    console.log("rota");
    if (!maps) return;

    const responseToPickup = await api.post("/maps/route/calculate/driver", {
      originLat: towData.driverLat,
      originLon: towData.driverLon,
      DestinationLat: towData.pickupLat,
      DestinationLon: towData.pickupLon,
    });

    const routeDriverToPickup = responseToPickup.data;

    const routeDriverToPickupPositions = routeDriverToPickup.polyline.map(
      (p: any) => [p.lat, p.lon]
    );

    const poly = L.polyline(routeDriverToPickupPositions, {
      weight: 4,
      opacity: 0.6,
    });

    maps.fitBounds(poly.getBounds(), { padding: [60, 60] });

    L.marker([towData.pickupLat, towData.pickupLon], {
      icon: userIcon,
    }).addTo(maps);

    const origin: Position = {
      lat: towData.pickupLat,
      lon: towData.pickupLon,
    };

    const destination: Position = {
      lat: towData.destinationLat,
      lon: towData.destinationLon,
    };
    console.log("routeDriverToPickupPositions:");
    console.dir(routeDriverToPickupPositions);
    props.setRouteG(routeDriverToPickupPositions);

    await calcularRotaDestino(origin, destination);
  }

  return (
    <>
      <aside className="sidebar" style={{ width: props.sideBarW }}>
        {(!selectedTow && !towTravel) && (
          <>
            <div className="sidebar-header">
              <span className="status-label">
                {isAvailable ? "Disponível" : "Indisponível"}
              </span>

              <div
                className={`toggle ${isAvailable ? "active" : ""}`}
                onClick={handleToggle}
              >
                <div className="toggle-circle" />
              </div>
            </div>
            <div className="search">
              <InputLocation
                locationText={props.locationText}
                setLocationText={props.setLocationText}
                setRouteG={props.setRouteG}
                setUserLocation={props.setUserLocation}
              />
            </div>

            {towReceived && towsReceive.length > 0 && (
              <>
                <span className="results-title">Pedidos de reboque</span>

                <div className="results">
                  {towsReceive.map((t) => {
                    const firstName = t.clientName.split(" ")[0];

                    return (
                      <div
                        key={t.id}
                        className="result-card driver-card"
                        onClick={() => setSelectedTow(t)}
                      >
                        <div className="card-main">
                          <div className="left">
                            <span className="client-name">{firstName}</span>
                            <span className="distance">
                              {t.totalDistanceKm}km
                            </span>
                            <span className="duration">
                              há {formatTime(getMinutesSince(t.createdAt))}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
        {(selectedTow || towTravel) && (
          <div className="tow-details">
            <button
              className="back"
              onClick={() => {
                setSelectedTow(null);
                props.setRoute(null);
                props.setRouteG(null);
              }}
            >
              ⬅
            </button>

            <h3 className="solicith3">Solicitação de serviço</h3>

            <div className="detail-top">
              <h3>{towTravel?.clientName || selectedTow?.clientName}</h3>
              <div className="detail-info">
                <div className="client-data">
                  <span className="phone">+55 48 9 8832-2133</span>
                </div>
              </div>
            </div>

            <div className="detail">
              {towTravel && (
                <>
                  <InputLocation
                    locationText={props.locationText}
                    setLocationText={props.setLocationText}
                    setRouteG={props.setRouteG}
                    setUserLocation={props.setUserLocation}
                  />

                  <TowRequestData
                    distanceKm={
                      towTravel.distanceToPickupKm +
                      towTravel.distanceToDestinationKm
                    }
                    durationMin={
                      towTravel.timeToDestinationMin + towTravel.timeToPickupMin
                    }
                    priceEstimate={towTravel.finalPrice}
                    distanceKmG={
                      towTravel.distanceToPickupKm +
                      towTravel.distanceToDestinationKm
                    }
                    durationMinG={
                      towTravel.timeToDestinationMin + towTravel.timeToPickupMin
                    }
                    priceEstimateG={towTravel.finalPrice}
                    suggestedPrice={towTravel.finalPrice}
                    routeG={null}
                    modelo={null}
                    totalDistanceKm={
                      towTravel.distanceToPickupKm +
                      towTravel.distanceToDestinationKm
                    }
                  />

                  <div className="tow-extra">
                    <p>Questão: {towTravel.questions ?? "Veículo sem questões."}</p>

                    <p>Notas: {towTravel.notes ?? "Veículo sem notas."}</p>
                  </div>
                </>
              )}
              {!towTravel && selectedTow !== null && (
                <>
                  <TowRequestData
                    distanceKm={selectedTow.totalDistanceKm}
                    durationMin={selectedTow.durationMinutes}
                    priceEstimate={selectedTow.suggestedPrice}
                    distanceKmG={selectedTow.totalDistanceKm}
                    durationMinG={selectedTow.durationMinutes}
                    priceEstimateG={selectedTow.suggestedPrice}
                    suggestedPrice={selectedTow.suggestedPrice}
                    modelo={selectedTow.vehicleType}
                    totalDistanceKm={selectedTow.totalDistanceKm}
                  />

                  <div className="tow-extra">
                    <p>Questão: {selectedTow.vehicleIssue}</p>

                    <p>Notas: {selectedTow.notes}</p>
                  </div>

                  {(selectedTow.status !== 2 ||
                    selectedTow.counterOfferRecused) && (
                    <button
                      className={`accept-btn secondary contact-enabled ${
                        selectedTow!.status === 4 && "accepted"
                      }`}
                      onClick={() => acceptTowRequest()}
                      disabled={selectedTow.status === 4}
                    >
                      {selectedTow.status === 4
                        ? "Solicitação aceita!"
                        : "Aceitar"}
                    </button>
                  )}

                  {selectedTow.status != 4 && (
                    <button
                      className={buttonCounterClass()}
                      onClick={() => setShowCounterModal(!showCounterModal)}
                      disabled={
                        selectedTow.status === 2 ||
                        selectedTow.counterOfferRecused
                      }
                    >
                      {selectedTow.counterOfferRecused
                        ? "Countra proposta recusada!"
                        : selectedTow.status !== 2
                        ? "Enviar contraproposta"
                        : selectedTow.status === 2
                        ? "Contraproposta enviada!"
                        : selectedTow.status === 4
                        ? "Contra proposta aceita!"
                        : ""}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        <div className="resize-handle" onMouseDown={handleMouseDown} />
      </aside>
      {selectedTow !== null &&
        !selectedTow.counterOfferRecused &&
        showCounterModal && (
          <CounterOfferModal
            price={selectedTow.suggestedPrice}
            onClose={() => {
              setShowCounterModal(false);
            }}
            setSelectedTow={setSelectedTow}
            towRequest={selectedTow}
            setTowsReceived={setTowsReceive}
          />
        )}
    </>
  );
}
function formatTime(minutes: number) {
  const totalSeconds = minutes * 60;

  if (totalSeconds < 60) {
    return `${Math.floor(totalSeconds)}s`;
  }

  if (minutes < 60) {
    return `${Math.floor(minutes)}min`;
  }

  const hours = minutes / 60;

  if (hours >= 24) {
    return `${(hours / 24).toFixed(1)}d`;
  }

  return `${hours.toFixed(1)}h`;
}

function getMinutesSince(dateValue: string | number | Date) {
  const created = new Date(dateValue).getTime();
  const now = Date.now();

  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  return diffMinutes;
}

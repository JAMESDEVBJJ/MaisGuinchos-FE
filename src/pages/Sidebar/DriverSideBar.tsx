import { useState, useEffect, useRef } from "react";
import { InputLocation } from "./InputLocation";
import type { Position } from "../../dtos/MapPropsDTO";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import * as signalR from "@microsoft/signalr";
import { api } from "../../services/api";
import { TowRequestData } from "./TowRequestData";
import CounterOfferModal from "./CounterTowModal";
import type {
  AcceptTowRequestResponseDTO,
  RejectTowRequestResponseDTO,
} from "../../dtos/AcceptTowRequestResponseDTO";
import L from "leaflet";
import iconClient from "../../assets/icons/iconUser.png";
import { TowTravelStatus } from "../../utils/enums/TowTravelStatus";
import { useTowTravel } from "../../contexts/TowTravelContext";
import type { TowTravelDTO } from "../../dtos/TowTravelDTO";
import { RouteType, type RouteRealtimeDTO } from "../../dtos/RouteRealtimeDTO";
import iconGuincho from "../../assets/icons/guinchoMarkup.png";
import { toast } from "react-toastify";
import { SettingsButton } from "./SettingsButton";
import { LoadingSpinner } from "../Ui/LoadingSpinner";
import { TowRequestStatus } from "../../utils/towsRequestsUtils";
import UserProfileCard from "./UserProfileCard";
import VehicleClientInfo from "./VehicleClientInfo";
import TripDetails from "./TripDetails";
import { TowActionButtons } from "./TowActionBtns";
import { TowExtraDetails } from "./DetailRow";

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

  const [loading, setLoading] = useState(false);

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

  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await api.get("/guincho/status");
        setIsAvailable(response.data.status);
      } catch (error) {
        toast.error("Erro ao carregar status.");
      } finally {
        setLoadingStatus(false);
      }
    }

    loadStatus();
  }, []);

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
      return [novoTow, ...filtradas];
    });
  };

  useEffect(() => {
    if (!token) return;

    async function getPendingTowsRequests() {
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

    getPendingTowsRequests();
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
        console.log("Conectado ao TowHub como driver");
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
          origin: { latitude: data.driverLat, longitude: data.driverLon },
          destination: {
            latitude: data.destinationLat,
            longitude: data.destinationLon,
          },
          pickup: { latitude: data.pickupLat, longitude: data.pickupLon },
          truck: {
            id: data.truck.id,
            model: data.truck.model,
            color: data.truck.color,
            plate: data.truck.plate,
          },
          notes: data.notes,
          questions: data.questions,
          driverPhoto: data.driverPhotoUrl,
          vehicleModelClient: data.vehicleModel,
          driverPhone: data.driverPhone,
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
      }
    });

    connection.on("ArrivedAtPickup", () => {
      setTowTravel((prev) => {
        if (!prev) return null;

        return { ...prev, status: TowTravelStatus.ArrivedAtPickup };
      });
    });

    connection.on("ArrivedAtDestination", () => {
      setTowTravel((prev) => {
        if (!prev) return null;

        return { ...prev, status: TowTravelStatus.ArrivedAtDestination };
      });
    });

    return () => {
      connection.stop();
    };
  }, []);

  const getTravelMessage = () => {
    if (!towTravel) {
      return "Solicitação de serviço";
    }

    switch (towTravel.status) {
      case TowTravelStatus.GoingToClient:
        return "Vá até o veículo.";

      case TowTravelStatus.ArrivedAtPickup:
        return "Reboque em andamento";

      case TowTravelStatus.InProgress:
        return "Vá até o destino.";

      case TowTravelStatus.Finished:
        return "Corrida finalizada!";

      case TowTravelStatus.Cancelled:
        return "Corrida cancelada!";

      default:
        return "";
    }
  };

  async function acceptTowRequest() {
    if (selectedTow) {
      try {
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
          origin: { latitude: data.driverLat, longitude: data.driverLon },
          destination: {
            latitude: data.destinationLat,
            longitude: data.destinationLon,
          },
          pickup: { latitude: data.pickupLat, longitude: data.pickupLon },
          truck: {
            id: data.truck.id,
            model: data.truck.model,
            color: data.truck.color,
            plate: data.truck.plate,
          },
          notes: data.notes,
          questions: data.questions,
          driverPhoto: data.driverPhotoUrl,
          vehicleModelClient: data.vehicleModel,
          driverPhone: data.driverPhone,
        };

        setSelectedTow((prev) => {
          if (!prev || prev.id !== data.towRequestId) return prev;

          return { ...prev, status: 4 };
        });

        setTowsReceive((prev) =>
          prev.filter((t) => t.id !== data.towRequestId)
        );

        setTowTravel(towTravel);

        calcularRotaTowTravel(data);
      } catch (error: any) {
        const data = error.response?.data;
        if (data?.errors) {
          Object.values(data.errors).forEach((messages: any) => {
            messages.forEach((message: string) => {
              toast.error(message);
            });
          });
        } else if (data?.error) {
          toast.error(data.error);
        } else {
          toast.error("Erro ao tentar aceitar pedido de reboque.");
        }

        console.error("Erro ao tentar aceitar pedido de reboque", error);
      }
    }
  }

  async function startJourney(towTravel: TowTravelDTO) {
    try {
      setLoading(true);

      const response = await api.post(
        `towtravel/${towTravel.id}/start-journey`
      );

      const data = response.data;

      setTowTravel((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          status: data.status,
        };
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao iniciar trajeto.");
    } finally {
      setLoading(false);
    }
  }

  async function finishTravel(towTravel: TowTravelDTO) {
    try {
      setLoading(true);

      const response = await api.post(`towtravel/${towTravel.id}/finish`);

      const data = response.data;

      setTowTravel((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          status: data.status,
        };
      });
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Erro ao finalizar reboque.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function calcularRotaDestino(origin: Position, destination: Position) {
    const response = await api.post("/maps/route/calculate", {
      originLat: origin.lat,
      originLon: origin.lon,
      destinationLat: destination.lat,
      destinationLon: destination.lon,
    });

    const route = response.data;

    const routePositions = route.polyline.map((p: any) => [p.lat, p.lon]);

    props.setRoute(routePositions);

    const maps = props.mapRef.current;

    if (!maps) return;

    const poly = L.polyline(routePositions, { weight: 4, opacity: 0.6 });
    maps.fitBounds(poly.getBounds(), { padding: [60, 60] });
  }

  async function calcularRotaTowTravel(towData: AcceptTowRequestResponseDTO) {
    const maps = props.mapRef.current;
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

    props.setRouteG(routeDriverToPickupPositions);

    await calcularRotaDestino(origin, destination);
  }

  async function rejectTowRequest() {
    if (selectedTow) {
      try {
        const response = await api.put(
          `towrequests/${selectedTow.id}/reject-tow`
        );

        const data: RejectTowRequestResponseDTO = response.data;

        setSelectedTow((prev) => {
          if (!prev || prev.id !== data.id) return prev;
          return { ...prev, status: TowRequestStatus.Rejected };
        });

        setTowsReceive((prev) => prev.filter((t) => t.id !== data.id));
      } catch (error: any) {
        const data = error.response?.data;
        if (data?.errors) {
          Object.values(data.errors).forEach((messages: any) => {
            messages.forEach((message: string) => {
              toast.error(message);
            });
          });
        } else if (data?.error) {
          toast.error(data.error);
        } else {
          toast.error("Erro ao tentar recusar pedido de reboque.");
        }
        console.error("Erro ao tentar recusar pedido de reboque", error);
      }
    }
  }

  return (
    <>
      <aside className="sidebar" style={{ width: props.sideBarW }}>
        {!selectedTow && !towTravel && (
          <>
            <div className="sidebar-header">
              <SettingsButton />
              {loadingStatus && (
                <LoadingSpinner size={25} padding={0}></LoadingSpinner>
              )}
              {!loadingStatus && (
                <>
                  <span className="status-label">
                    {isAvailable ? "Disponível" : "Indisponível"}
                  </span>
                  <div
                    className={`toggle ${isAvailable ? "active" : ""}`}
                    onClick={handleToggle}
                  >
                    <div className="toggle-circle" />
                  </div>
                </>
              )}
            </div>
            <div className="search">
              <InputLocation
                locationText={props.locationText}
                setLocationText={props.setLocationText}
                setRouteG={props.setRouteG}
                setUserLocation={props.setUserLocation}
              />
            </div>

            {towReceived && towsReceive.length > 0 ? (
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
                              {t.totalDistanceKm.toFixed(2)} Km
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
            ) : (
              <>
                <div className="results-title">
                  Nenhum pedido de reboque recebido.
                </div>
                <div className="results"></div>
              </>
            )}
          </>
        )}
        {(selectedTow || towTravel) && (
          <div className="tow-details">
            {(!towTravel ||
              towTravel?.status === TowTravelStatus.Finished ||
              towTravel?.status === TowTravelStatus.Cancelled) && (
              <button
                className="back"
                onClick={() => {
                  setSelectedTow(null);
                  props.setRoute(null);
                  props.setRouteG(null);
                  setTowTravel(null);

                  const maps = props.mapRef.current;
                  if (driverMarkerRef.current && maps) {
                    maps.removeLayer(driverMarkerRef.current);
                    driverMarkerRef.current = null;
                  }
                }}
              >
                ⬅
              </button>
            )}

            <h3 className="solicith3">{getTravelMessage()}</h3>

            <div className="detail">
              <div className="detail-top">
                <UserProfileCard
                  role="Cliente"
                  initials={(
                    towTravel?.clientName ||
                    selectedTow?.clientName ||
                    ""
                  )
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                  name={towTravel?.clientName || selectedTow?.clientName || ""}
                  phone={
                    towTravel?.clientPhone || selectedTow?.clientPhone || ""
                  }
                />
              </div>
              {towTravel && (
                <>
                  {towTravel.status !== TowTravelStatus.ArrivedAtDestination &&
                    towTravel.status !== TowTravelStatus.ArrivedAtPickup &&
                    towTravel.status !== TowTravelStatus.Finished && (
                      <InputLocation
                        locationText={props.locationText}
                        setLocationText={props.setLocationText}
                        setRouteG={props.setRouteG}
                        setUserLocation={props.setUserLocation}
                      />
                    )}

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

                  <TowExtraDetails
                    questions={towTravel.questions}
                    vehicleModel={towTravel.vehicleModelClient}
                    notes={towTravel.notes}
                  />

                  {towTravel.status === TowTravelStatus.ArrivedAtPickup && (
                    <button
                      disabled={loading}
                      className={`btn accept-btn secondary contact-enabled padding-top`}
                      onClick={() => startJourney(towTravel)}
                    >
                      Iniciar trajeto
                    </button>
                  )}

                  {towTravel.status ===
                    TowTravelStatus.ArrivedAtDestination && (
                    <button
                      disabled={loading}
                      className={`btn accept-btn contact-enabled padding-top`}
                      onClick={() => finishTravel(towTravel)}
                    >
                      Finalizar serviço
                    </button>
                  )}
                </>
              )}
              {!towTravel && selectedTow !== null && (
                <>
                  <TowExtraDetails
                    questions={
                      selectedTow.vehicleIssue || "Veículo sem questões."
                    }
                    vehicleModel={selectedTow.vehicleType || ""}
                    notes={selectedTow.notes || ""}
                  />

                  <TripDetails
                    distanceKm={selectedTow.totalDistanceKm}
                    durationHours={selectedTow.durationMinutes / 60}
                    priceEstimate={selectedTow.suggestedPrice}
                  />

                  <TowActionButtons
                    status={selectedTow.status}
                    counterOfferRecused={selectedTow.counterOfferRecused}
                    onAccept={acceptTowRequest}
                    onCounterOffer={() =>
                      setShowCounterModal(!showCounterModal)
                    }
                    onReject={rejectTowRequest}
                  />

                  {selectedTow.status === TowRequestStatus.Rejected && (
                    <div className="proposal-rejected">
                      <div className="proposal-rejected-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          />
                          <path
                            d="M9.5 9.5L14.5 14.5M14.5 9.5L9.5 14.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="proposal-rejected-content">
                        <strong>Proposta rejeitada</strong>
                      </div>
                    </div>
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

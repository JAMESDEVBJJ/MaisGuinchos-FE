import { useEffect, useRef, useState } from "react";
import iconDestination from "../../assets/icons/detinIcon.png";
import GuinchosResults from "./GuinchosResults";
import { api } from "../../services/api";
import L from "leaflet";
import defaultUserPng from "../../assets/defaultUser.png";
import type { GuinchosDto, Position } from "../../dtos/MapPropsDTO";
import { InputLocation } from "./InputLocation";
import * as signalR from "@microsoft/signalr";
import { TowRequestData } from "./TowRequestData";
import ReceiveCounterTowModal from "./ReceiveCounterTowModal";
import { useTowTravel } from "../../contexts/TowTravelContext";
import type { AcceptTowRequestResponseDTO } from "../../dtos/AcceptTowRequestResponseDTO";
import { TowTravelStatus } from "../../utils/enums/TowTravelStatus";
import { RouteType, type RouteRealtimeDTO } from "../../dtos/RouteRealtimeDTO";
import iconGuincho from "../../assets/icons/guinchoMarkup.png";
import type { TowTravelDTO } from "../../dtos/TowTravelDTO";
import type { TowRequestDTO } from "../../dtos/TowRequestDTO";
import { toast } from "react-toastify";
import { useTowRequest } from "../../contexts/TowRequestsContext";
import type { RouteDTO } from "../../dtos/RouteDTO";
import { mapToTowRequest } from "../../mappers/TowRequestMapper";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import { SettingsButton } from "./SettingsButton";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import { LoadingSpinner } from "../Ui/LoadingSpinner";

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
      | "rejected"
      | "cancelled"
    >
  >;
  requestStatus: string;
  hideDriverPhoto: boolean;
  hasActiveTowRequest: boolean;
  setHasActiveTowRequest: React.Dispatch<React.SetStateAction<boolean>>;
};
export function ClientSideBar(props: ClientBarProps) {
  const token = localStorage.getItem("token");

  const distanceRouteTotal =
    props.distanceKm + (props.distanceKmG ? props.distanceKmG : 0);

  const priceRouteTotal = props.priceEstimateG
    ? props.priceEstimate + props.priceEstimateG
    : props.priceEstimate;

  const routeLayerRef = useRef<L.Layer | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [vehicleType, setVehicleType] = useState("");
  const [vehicleIssue, setVehicleIssue] = useState("");
  const [notes, setNotes] = useState("");

  const [towRequest, setTowRequest] = useState<TowRequestDTO | null>(null);

  const { setActiveTowsRequests } = useTowRequest();

  const [showGetCounterModal, setShowGetCounterModal] = useState(false);

  const {
    towTravel,
    setTowTravel,
    clearTowTravel,
    setTowTravelStatus,
    setRoutes,
  } = useTowTravel();

  const foto = towTravel
    ? towTravel.driverPhoto
    : props.selectedGuincho?.motorista?.foto;
  const isDefault = !foto || foto.trim() === "";

  const serviceIsDisabled =
    !props.routeG ||
    !props.route ||
    props.requestStatus === "waitingDriver" ||
    props.requestStatus === "counterOfferRejected" ||
    props.requestStatus === "accepted";

  const [dots, setDots] = useState("");

  const driverMarkerRef = useRef<L.Marker | null>(null);
  const driverName = towTravel?.driverName
    ? towTravel?.driverName
    : props.selectedGuincho?.motorista.name;

  const guinchoIcon = new L.Icon({
    iconUrl: iconGuincho,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const { activeTowsRequests } = useTowRequest();

  const location = useLocation();

  const [loadingDriver, setLoadingDriver] = useState(false);

  useEffect(() => {
    const driverId = location.state?.driverId;

    if (!driverId) return;

    async function loadDriver() {
      try {
        setLoadingDriver(true);

        const guincho: GuinchosDto | undefined = await getGuinchoByDriverId(
          driverId
        );

        if (guincho) {
          props.setSelectedGuincho(guincho);
        }
      } finally {
        setLoadingDriver(false);
      }
    }

    loadDriver();
  }, [location.state]);

  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    async function loadTowRequest() {
      try {
        setLoadingRoute(true);

        const selectedDriver = props.selectedGuincho;
        if (!selectedDriver) return;

        const activeTow = activeTowsRequests.find(
          (x) => x.driverId === selectedDriver.motorista.userId
        );

        if (!activeTow) return;

        const status = mapTowRequestStatus(activeTow.status);
        props.setHasActiveTowRequest(true);
        props.setRequestStatus(status);
        setTowRequest(mapToTowRequest(activeTow));

        const routes: { toPickup: RouteDTO; toDestination: RouteDTO } | null =
          await calculateRoutes(
            selectedDriver.motorista.lat,
            selectedDriver.motorista.lon,
            activeTow.pickupLat,
            activeTow.pickupLon,
            activeTow.dropoffLat,
            activeTow.dropoffLon
          );

        if (!routes) return;

        setRoutes(routes);
        props.setDistanceKmG(routes.toPickup.distanceKm);
        props.setPriceG(routes.toPickup.priceEstimate);
        props.setDurationMinG(routes.toPickup.durationMinutes);
        props.setRouteG(
          routes.toPickup.polyline.map(
            (c) => [c.lat, c.lon] as [number, number]
          )
        );
      } catch (error) {
        toast.error("Erro ao carregar a rota.");
      } finally {
        setLoadingRoute(false);
      }
    }

    loadTowRequest();
  }, [props.selectedGuincho, activeTowsRequests]);

  async function getGuinchoByDriverId(driverId: string) {
    try {
      const response = await api.get<GuinchosDto>(`/user/driver/${driverId}`);

      const driver = response.data;

      if (driver) {
        return driver;
      }

      toast.error("Não foi possível encontrar o motorista da solicitação.");
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
        toast.error("Erro ao buscar guincho solicitado.");
      }
    }
  }

  function mapTowRequestStatus(status: number) {
    switch (status) {
      case 1:
        return "waitingDriver";

      case 2:
        return "counterOfferReceived";

      case 3:
        return "counterOfferRejected";

      case 4:
        return "accepted";

      case 5:
        return "rejected";

      case 6:
        return "cancelled";

      default:
        return "cancelled";
    }
  }

  async function calculateRoutes(
    driverLat: number,
    driverLon: number,
    pickupLat: number,
    pickupLon: number,
    dropoffLat: number,
    dropoffLon: number
  ) {
    const responseToPickup = await api.post("/maps/route/calculate", {
      originLat: driverLat,
      originLon: driverLon,
      destinationLat: pickupLat,
      destinationLon: pickupLon,
    });

    const responseToDestination = await api.post("/maps/route/calculate", {
      originLat: pickupLat,
      originLon: pickupLon,
      destinationLat: dropoffLat,
      destinationLon: dropoffLon,
    });

    return {
      toPickup: responseToPickup.data,
      toDestination: responseToDestination.data,
    };
  }

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

      setActiveTowsRequests((prev) =>
        prev.filter((x) => x.id !== data.towRequestId)
      );

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
        vehicleModelClient: data.vehicleModel,
        driverPhoto: data.driverPhotoUrl,
        driverPhone: data.driverPhone,
      };

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

    connection.on("ReceiveCounterOffer", (data: TowRequestDTO) => {
      props.setRequestStatus("counterOfferReceived");

      setTowRequest(data);
    });

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

    connection.on("DriverArrivedAtPickup", () => {
      setTowTravel((prev) => {
        if (prev === null) {
          return null;
        }

        return { ...prev, status: TowTravelStatus.ArrivedAtPickup };
      });

      props.setRouteG([]);
    });

    connection.on("DriverArrivedAtDestination", () => {
      setTowTravel((prev) => {
        if (prev === null) {
          return null;
        }

        return { ...prev, status: TowTravelStatus.ArrivedAtDestination };
      });
      props.setRoute(null);
    });

    connection.on("JourneyStarted", () => {
      setTowTravel((prev) => {
        if (prev === null) {
          return null;
        }

        return { ...prev, status: TowTravelStatus.InProgress };
      });
    });

    connection.on("JourneyFinished", () => {
      setTowTravel((prev) => {
        if (prev === null) {
          return null;
        }

        return { ...prev, status: TowTravelStatus.Finished };
      });
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    if (!towTravel) return;

    const maps = props.mapRef.current;
    if (!maps || driverMarkerRef.current) return;

    const newLatLng: [number, number] = [
      towTravel.origin.latitude,
      towTravel.origin.longitude,
    ];

    driverMarkerRef.current = L.marker(newLatLng, {
      icon: guinchoIcon,
    }).addTo(maps);
  }, [towTravel]);

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

  useEffect(() => {
    if (!towTravel) return;
    if (
      towTravel.status !== TowTravelStatus.GoingToClient &&
      towTravel.status !== TowTravelStatus.InProgress
    ) {
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
  }, [towTravel?.status]);

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
    const map = props.mapRef.current;

    if (routeLayerRef.current) {
      if (map) {
        map.removeLayer(routeLayerRef.current);
      }
      routeLayerRef.current = null;
    }

    if (driverMarkerRef.current && map) {
      map.removeLayer(driverMarkerRef.current);
      driverMarkerRef.current = null;
    }

    if (
      towTravel?.status === TowTravelStatus.Finished ||
      towTravel?.status === TowTravelStatus.Cancelled
    ) {
      props.setRoute(null);
    }

    clearTowTravel();
    if (props.hasActiveTowRequest) {
      props.setHasActiveTowRequest(false);
      props.setRoute(null);
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
    setShowGetCounterModal(false);
  }

  async function handleConfirmSend() {
    if (!props.selectedGuincho) {
      toast.error("Selecione um motorista primeiro.");
      return;
    }

    if (!props.userLocation || !props.destination) {
      toast.error("Localização inválida.");
      return;
    }

    if (!vehicleType || !vehicleIssue) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    if (!props.distanceKmG || !props.durationMinG) {
      toast.error("Dados da rota do até o usuário inválidos.");
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

      suggestedPrice: priceRouteTotal,

      vehicleType: vehicleType,
      vehicleIssue: vehicleIssue,
      notes: notes,
    };

    try {
      const response = await api.post("/towrequests", towRequestDto);
      const data = response.data as TowRequestReceiveDto;
      setActiveTowsRequests((prev) => [...prev, data]);

      setShowModal(false);
      setVehicleType("");
      setVehicleIssue("");
      setNotes("");
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
        toast.error("Erro inesperado ao solicitar guincho.");
      }
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

  const getStatusMessage = (
    status: TowTravelStatus,
    driverName: string | undefined
  ) => {
    const messages: Record<TowTravelStatus, string> = {
      [TowTravelStatus.GoingToClient]: `${driverName} está indo até o veículo${dots}`,
      [TowTravelStatus.ArrivedAtPickup]: `${driverName} chegou até o veículo.`,
      [TowTravelStatus.InProgress]: `${driverName} está indo até o destino${dots}`,
      [TowTravelStatus.ArrivedAtDestination]: `${driverName} chegou ao destino.`,
      [TowTravelStatus.Finished]: `${driverName} finalizou o atendimento!`,
      [TowTravelStatus.Cancelled]: `Reboque cancelado.`,
    };

    return messages[status] || `${driverName} - Status: ${status}`;
  };

  return (
    <>
      <aside className="sidebar" style={{ width: props.sidebarW }}>
        {props.selectedGuincho == null && !towTravel ? (
          <>
            <SettingsButton />
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

            {props.loading && <LoadingSpinner></LoadingSpinner>}
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
          <div className="tow-details">
            <div className="detail">
              {(!towTravel ||
                towTravel.status === TowTravelStatus.Cancelled ||
                towTravel.status === TowTravelStatus.Finished) && (
                <button className="back-button" onClick={handleBackToList}>
                  <ArrowLeft size={22} />
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

                <div
                  className={`detail-info ${
                    props.hideDriverPhoto ? "only-content" : ""
                  }`}
                >
                  {towTravel ? (
                    <h3>{getStatusMessage(towTravel.status, driverName)}</h3>
                  ) : (
                    <h3>{props.selectedGuincho?.motorista.name}</h3>
                  )}

                  {!towTravel ? (
                    <>
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
                        <div>
                          Placa: {props.selectedGuincho?.motorista.placa}
                        </div>
                        <div>Cor: {props.selectedGuincho?.color}</div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="detail-actions">
                {!towTravel && !props.hasActiveTowRequest && (
                  <button
                    className="primary fullwidth"
                    onClick={calcularRotaComGuincho}
                  >
                    Calcular rota
                  </button>
                )}
              </div>
              {loadingDriver || loadingRoute ? (
                <LoadingSpinner></LoadingSpinner>
              ) : (
                props.routeG &&
                props.distanceKmG != null &&
                props.durationMinG != null &&
                props.priceEstimateG != null &&
                !towTravel && (
                  <>
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
                  </>
                )
              )}
              {towTravel && (
                <>
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
                    <p>Modelo: {towTravel.truck.model}</p>
                    <p>Placa: {towTravel.truck.plate}</p>
                    <p>Cor: {towTravel.truck.color}</p>
                    <p>Telefone: {towTravel.driverPhone}</p>
                  </div>
                </>
              )}
            </div>
          </div>
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

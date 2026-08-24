import { useEffect, useRef, useState } from "react";
import iconDestination from "../../assets/icons/detinIcon.png";
import GuinchosResults from "./GuinchosResults";
import { api } from "../../services/api";
import L from "leaflet";
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
import Filtro, { type FiltroId } from "./Filtros";
import TripDetails from "./TripDetails";
import UserProfileCard from "./UserProfileCard";
import { TowRequestStatus } from "../../utils/towsRequestsUtils";
import { TowExtraDetails } from "./DetailRow";
import { useAuth } from "../../contexts/AuthContext";

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
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  priceEstimate: number;
  setDistanceKm: React.Dispatch<React.SetStateAction<number>>;
  distanceKm: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
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
    React.SetStateAction<TowRequestStatus | null>
  >;
  requestStatus: TowRequestStatus | null;
  hideDriverPhoto: boolean;
  hasActiveTowRequest: boolean;
  setHasActiveTowRequest: React.Dispatch<React.SetStateAction<boolean>>;
  activeFilters: FiltroId[];
  setActiveFilters: React.Dispatch<React.SetStateAction<FiltroId[]>>;
};
export function ClientSideBar(props: ClientBarProps) {
  const token = localStorage.getItem("token");

  const { user } = useAuth();

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
    props.requestStatus === TowRequestStatus.WaitingDriverResponse ||
    props.requestStatus === TowRequestStatus.CounterOfferRejected ||
    props.requestStatus === TowRequestStatus.Accepted ||
    props.requestStatus === TowRequestStatus.Rejected ||
    props.requestStatus === TowRequestStatus.Cancelled;

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

  const abortControllerRef = useRef<AbortController | null>(null);

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

        props.setHasActiveTowRequest(true);
        props.setRequestStatus(activeTow.status);
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

        props.setRoute(
          routes.toDestination.polyline.map(
            (c) => [c.lat, c.lon] as [number, number]
          )
        );
        props.setDistanceKm(routes.toDestination.distanceKm);
        props.setPrice(routes.toDestination.priceEstimate);
        props.setDuration(routes.toDestination.durationMinutes);
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

    connection.onreconnecting((error) => {
      console.log("SignalR reconectando...", error);
    });

    connection.onreconnected((connectionId) => {
      console.log("SignalR reconectado:", connectionId);
    });

    connection.onclose((error) => {
      console.log("SignalR conexão fechada:", error);
    });

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
      props.setRequestStatus(TowRequestStatus.Accepted);

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
      props.setRequestStatus(TowRequestStatus.CounterOfferSent);
      setActiveTowsRequests((prev) =>
        prev.map((x) =>
          x.id === data.id
            ? {
                ...x,
                counterOfferPrice: data.counterOfferPrice,
                status: TowRequestStatus.CounterOfferSent,
                counterOfferPercent: data.counterOfferPercent,
                counterOfferReason: data.counterOfferReason,
                counterOfferAt: data.counterOfferAt,
              }
            : x
        )
      );
      setTowRequest(data);
    });

    connection.on("TowRequestRejected", (data: TowRequestDTO) => {
      props.setRequestStatus(TowRequestStatus.Rejected);

      setActiveTowsRequests((prev) => prev.filter((x) => x.id !== data.id));

      setTowRequest((prev) => {
        if (!prev || prev.id !== data.id) return prev;

        return { ...prev, status: TowRequestStatus.Rejected };
      });
      toast(
        `O motorista ${data.driverName} recusou sua solicitação de reboque.`,
        {
          icon: <ExclamationIcon />,
          style: {
            backgroundColor: "#1E293B",
            color: "#FFFFFF",
          },
          progressClassName: "custom-progress-bar",
        }
      );
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

    startConnection();

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
    if (props.requestStatus !== TowRequestStatus.WaitingDriverResponse) {
      if (props.requestStatus !== TowRequestStatus.CounterOfferRejected) {
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

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      props.setRouteG(null);
      props.setDistanceKmG(null);
      props.setDurationMinG(null);
      props.setPriceG(null);
    };
  }, []);

  async function calcularRotaComGuincho() {
    if (!props.selectedGuincho) return;

    abortControllerRef.current?.abort();

    const abortController = new AbortController();

    abortControllerRef.current = abortController;

    try {
      setLoadingRoute(true);

      const origemLat = props.selectedGuincho.motorista.lat;
      const origemLon = props.selectedGuincho.motorista.lon;

      const destino = props.userLocation;

      const response = await api.post(
        "/maps/route/calculate/driver",
        {
          originLat: origemLat,
          originLon: origemLon,
          destinationLat: destino?.lat,
          destinationLon: destino?.lon,
        },
        {
          signal: abortController.signal,
        }
      );

      if (abortController.signal.aborted) return;

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

      const poly = L.polyline(routePositions, {
        weight: 4,
        opacity: 0.6,
      });

      map.flyToBounds(poly.getBounds(), {
        padding: [60, 60],
        duration: 0.5,
      });
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
        toast.error("Erro ao calcular a rota.");
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoadingRoute(false);
      }
    }
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

    abortControllerRef.current?.abort();
    setLoadingRoute(false);

    props.setPriceG(null);
    props.setDistanceKmG(null);
    props.setDurationMinG(null);
    props.setRouteG(null);
    props.setDuration(0);
    props.setPrice(0);
    props.setDistanceKm(0);
    props.setHoveredGuinchoId(null);
    props.setSelectedGuincho(null);
    props.setRequestStatus(TowRequestStatus.Idle);
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
      case TowRequestStatus.WaitingDriverResponse:
        return `Aguardando motorista${dots}`;
      case TowRequestStatus.CounterOfferSent:
        return "Contraproposta recebida!";
      case TowRequestStatus.CounterOfferRejected:
        return `Aguardando motorista${dots}`;
      case TowRequestStatus.Accepted:
        return "Solitação aceita!";
      case TowRequestStatus.Rejected:
        return "Solicitação rejeitada!";
      case TowRequestStatus.Cancelled:
        return "Solicitação cancelada!";
      default:
        return "Solicitar Guincho";
    }
  };

  const buttonCounterClass = () => {
    if (
      props.requestStatus === TowRequestStatus.WaitingDriverResponse ||
      props.requestStatus === TowRequestStatus.CounterOfferRejected
    )
      return "btn counter-btn fullwidth waiting";

    if (props.requestStatus === TowRequestStatus.CounterOfferSent)
      return "btn accept-btn fullwidth contact-enabled ";

    if (props.requestStatus === TowRequestStatus.Accepted) {
      return "btn contact-enabled accepted fullwidth";
    }

    if (props.routeG && props.route)
      return "btn accept-btn fullwidth contact-enabled";

    return "btn accept-btn fullwidth";
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

                <button onClick={props.buscarGuinchos} className="btn-search">
                  Buscar guinchos
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </div>

            {props.loading && (
              <LoadingSpinner size={65} padding={"35px 0px"}></LoadingSpinner>
            )}
            {!props.loading && props.guinchos.length === 0 && (
              <div className="empty-state">
                <p>Digite sua localização e procure por guinchos.</p>
              </div>
            )}

            {props.guinchos.length >= 1 && (
              <Filtro
                activeFilters={props.activeFilters}
                onFiltersChange={props.setActiveFilters}
              />
            )}

            {!props.loading && props.guinchos.length >= 1 && (
              <>
                <GuinchosResults
                  isCompact={props.isCompact}
                  guinchos={props.guinchos}
                  setHovered={props.setHoveredGuinchoId}
                  mapRef={props.mapRef}
                  setSelectedGuincho={props.setSelectedGuincho}
                ></GuinchosResults>
              </>
            )}
          </>
        ) : (
          <div className="tow-details">
            {(!towTravel ||
              towTravel.status === TowTravelStatus.Cancelled ||
              towTravel.status === TowTravelStatus.Finished) && (
              <button
                className="back-button back-button-detail"
                onClick={handleBackToList}
              >
                <ArrowLeft size={22} />
              </button>
            )}
            <div className="detail detail-with-back">
              <div className="detail-top">
                <UserProfileCard
                  initials={
                    (
                      towTravel?.driverName ??
                      props.selectedGuincho?.motorista?.name
                    )
                      ?.split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() ?? ""
                  }
                  name={
                    towTravel?.driverName ??
                    props.selectedGuincho?.motorista?.name ??
                    ""
                  }
                  rating={props.selectedGuincho?.stars ?? 0}
                  reviewsCount={props.selectedGuincho?.stars ?? 0}
                  phone={
                    towTravel?.driverPhone ??
                    props.selectedGuincho?.motorista?.number ??
                    ""
                  }
                  photo={towTravel?.driverPhoto}
                  role="Motorista"
                />
              </div>

              <div className="detail-stack">
                {!towTravel && (
                  <TowExtraDetails
                    towVehicleModel={props.selectedGuincho?.model ?? ""}
                    towVehiclePlate={
                      props.selectedGuincho?.motorista.placa ?? ""
                    }
                    towVehicleColor={props.selectedGuincho?.color ?? ""}
                  />
                )}
                {!towTravel && !props.hasActiveTowRequest && (
                  <button
                    className="btn primary fullwidth"
                    onClick={calcularRotaComGuincho}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="6" cy="19" r="3" />
                      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                      <circle cx="18" cy="5" r="3" />
                    </svg>
                    Calcular rota
                  </button>
                )}

                {loadingDriver || loadingRoute ? (
                  <LoadingSpinner size={65}></LoadingSpinner>
                ) : (
                  props.routeG &&
                  props.distanceKmG != null &&
                  props.durationMinG != null &&
                  props.priceEstimateG != null &&
                  !towTravel && (
                    <>
                      <TripDetails
                        durationHours={
                          (props.duration + props.durationMinG) / 60
                        }
                        driverRoute={{
                          distanceKm: props.distanceKmG,
                          priceEstimate: props.priceEstimateG,
                        }}
                        userRoute={{
                          distanceKm: props.distanceKm,
                          priceEstimate: props.priceEstimate,
                        }}
                        showBreakdown={user?.isClient && !towTravel}
                      />

                      {props.requestStatus === TowRequestStatus.Rejected ? (
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
                            <span>
                              Esta solicitação não está mais disponível para
                              negociação.
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          className={buttonCounterClass()}
                          disabled={serviceIsDisabled}
                          onClick={
                            props.requestStatus ===
                            TowRequestStatus.CounterOfferSent
                              ? () => setShowGetCounterModal(true)
                              : () => setShowModal(true)
                          }
                        >
                          {buttonCounterAndSubmitText()}
                        </button>
                      )}
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
                        towTravel.timeToDestinationMin +
                        towTravel.timeToPickupMin
                      }
                      priceEstimate={towTravel.finalPrice}
                      distanceKmG={
                        towTravel.distanceToPickupKm +
                        towTravel.distanceToDestinationKm
                      }
                      durationMinG={
                        towTravel.timeToDestinationMin +
                        towTravel.timeToPickupMin
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
                      towVehicleModel={towTravel.truck.model}
                      towVehiclePlate={towTravel.truck.plate}
                      towVehicleColor={towTravel.truck.color}
                    />
                  </>
                )}
              </div>
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
              className={`btn fullwidth ${
                props.requestStatus === TowRequestStatus.WaitingDriverResponse
                  ? "counter-btn  waiting"
                  : props.routeG && props.route
                  ? "contact-enabled accept-btn"
                  : ""
              }`}
              disabled={
                serviceIsDisabled ||
                props.requestStatus ===
                  TowRequestStatus.WaitingDriverResponse ||
                props.requestStatus === TowRequestStatus.Rejected ||
                props.requestStatus === TowRequestStatus.Cancelled
              }
              onClick={handleConfirmSend}
            >
              {props.requestStatus === TowRequestStatus.WaitingDriverResponse ||
              props.requestStatus === TowRequestStatus.CounterOfferRejected
                ? `Aguardando motorista${dots}`
                : props.requestStatus === TowRequestStatus.CounterOfferSent
                ? "Contraproposta recebida!"
                : "Solicitar Guincho"}
            </button>
          </div>
        </div>
      )}
      {showGetCounterModal &&
        props.requestStatus !== TowRequestStatus.Accepted && (
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

const ExclamationIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      minWidth: "32px",
      minHeight: "32px",
      width: "32px",
      height: "32px",
    }}
  >
    <path
      d="M12 6V14M12 18H12.01"
      stroke="#FF7A00"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

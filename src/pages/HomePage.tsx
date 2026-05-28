import { useEffect, useState } from "react";
import "../styles/Home.css";
import { api } from "../services/api";
import { Maps } from "./Maps";
import {
  type MapProps,
  type Position,
  type GuinchosDto,
} from "../dtos/MapPropsDTO";
import { useRef } from "react";
import L from "leaflet";
import { Sidebar, type SidebarProps } from "./Sidebar/SideBar";
import type { CoordinateDto } from "../dtos/CoordinateDTO";
import { useTowTravel } from "../contexts/TowTravelContext";
import type { TowTravelDTO } from "../dtos/TowTravelDTO";
import type { TowTravelResponseDTO } from "../dtos/towTravel/TowTravelResponseDTO";
import { useTowRoutes } from "../utils/hooks/useTowRoutes";
import { TowTravelProgress } from "./TowTravelProgress";
import { toast } from "react-toastify/unstyled";

const HomePage = () => {
  const [priceEstimateG, setPriceG] = useState<number | null>(0);
  const [distanceKmG, setDistanceKmG] = useState<number | null>(0);
  const [durationMinG, setDurationMinG] = useState<number | null>(0);

  const [guinchos, setGuinchos] = useState<GuinchosDto[]>([]);

  const [selectedGuincho, setSelectedGuincho] = useState<GuinchosDto | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const [userLocation, setUserLocation] = useState<Position | null>(null);

  const [locationText, setLocationText] = useState<string>("");
  const [destinationText, setDestinationText] = useState<string>("");
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [routeG, setRouteG] = useState<[number, number][] | null>(null);
  const [destinationPosition, setDestinationPosition] =
    useState<Position | null>(null);

  const [priceEstimate, setPrice] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationMin, setDurationMin] = useState<number>(0);

  const [hoveredGuinchoId, setHoveredGuinchoId] = useState<string | null>(null);

  const [requestStatus, setRequestStatus] = useState<
    | "idle"
    | "sending"
    | "waitingDriver"
    | "accepted"
    | "counterOfferReceived"
    | "counterOfferRejected"
  >("idle");

  const { setTowTravel, towTravel } = useTowTravel();

  const { routes } = useTowRoutes(towTravel);

  const mapRef = useRef<L.Map | null>(null);

  const sideBarProps: SidebarProps = {
    locationText: locationText,
    setLocationText: setLocationText,
    destinationText: destinationText,
    setDestinationText: setDestinationText,
    buscarGuinchos: buscarGuinchos,
    guinchos: guinchos,
    selectedGuincho: selectedGuincho,
    setSelectedGuincho: setSelectedGuincho,
    setHoveredGuinchoId: setHoveredGuinchoId,
    setUserLocation: setUserLocation,
    userLocation: userLocation,
    handleUpdateDestination: handleUpdateDestination,
    setRouteG: setRouteG,
    routeG: routeG,
    setRoute: setRoute,
    route: route,
    loading: loading,
    priceEstimate: priceEstimate,
    distanceKm: distanceKm,
    duration: durationMin,
    mapRef: mapRef,
    priceEstimateG: priceEstimateG,
    setPriceG: setPriceG,
    distanceKmG: distanceKmG,
    setDistanceKmG: setDistanceKmG,
    durationMinG: durationMinG,
    setDurationMinG: setDurationMinG,
    destination: destinationPosition,
    durationMinTotal: durationMin + (durationMinG ? durationMinG : 0),
    setRequestStatus: setRequestStatus,
    requestStatus: requestStatus,
    setGuinchos: setGuinchos,
  };

  const mapsProps: MapProps = {
    motoristasPosition: guinchos,
    userPosition: userLocation,
    hoveredGuinchoId: hoveredGuinchoId,
    mapRef: mapRef,
    setRequestStatus: setRequestStatus,
    requestStatus: requestStatus,
    setSelectedGuincho: setSelectedGuincho,
    selectedGuincho: selectedGuincho,
    setPriceG: setPriceG,
    setDistanceKmG: setDistanceKmG,
    setDurationMinG: setDurationMinG,
    setHoveredGuinchoId: setHoveredGuinchoId,
    setRouteG: setRouteG,
    route: route,
    routeG: routeG,
    priceEstimate: priceEstimate,
    distanceKm: distanceKm,
    duration: durationMin,
    priceEstimateG: priceEstimateG,
    distanceKmG: distanceKmG,
    durationMinG: durationMinG,
  };

  useEffect(() => {
    async function loadLastLocation() {
      try {
        const response = await api.get("/maps/last-location");

        if (response.data) {
          setUserLocation({
            lat: response.data.latitude,
            lon: response.data.longitude,
          });
        } else {
          setUserLocation({ lat: -9.854179, lon: -51.648332 });
        }
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
          toast.error("Erro ao buscar última localização");
        }

        console.error("Erro ao buscar última localização", error);

        setUserLocation({ lat: -9.854179, lon: -51.648332 });
      }
    }
    loadLastLocation();
  }, []);

  useEffect(() => {
    const loadTow = async () => {
      const response = await api.get("/towTravel/pending");

      const towPending: TowTravelResponseDTO | null = response.data;

      if (towPending) {
        const towTravel: TowTravelDTO = {
          towRequestId: towPending.towRequestId,
          id: towPending.id,

          driverId: towPending.driverId,
          driverName: towPending.driverName,
          driverPhone: towPending.driverPhone,
          vehicleColorDriver: towPending.vehicleColorDriver,
          placaDriver: towPending.placaDriver,

          clientName: towPending.clientName,
          clientPhone: towPending.clientPhone,
          questions: towPending.questions,
          notes: towPending.notes,
          vehicleModelClient: towPending.vehicleModelClient,

          finalPrice: towPending.finalPrice,

          distanceToPickupKm: towPending.distanceToPickupKm,
          timeToPickupMin: towPending.timeToPickupMin,

          distanceToDestinationKm: towPending.distanceToDestinationKm,
          timeToDestinationMin: towPending.timeToDestinationMin,
          status: towPending.status,

          origin: towPending.origin,
          pickup: towPending.pickup,
          destination: towPending.destination,
          truck: {
            id: towPending.truck.id,
            model: towPending.truck.model,
            color: towPending.truck.color,
            plate: towPending.truck.plate,
          },
          driverPhoto: towPending.driverPhoto,
        };
        setTowTravel(towTravel);
      }
    };

    loadTow();
  }, []);

  useEffect(() => {
    if (!routes || !mapRef.current) return;

    const map = mapRef.current;

    const allLatLngs: [number, number][] = [];

    if (routes.toPickup) {
      const latlngs = routes.toPickup.polyline.map(
        (coord: CoordinateDto) => [coord.lat, coord.lon] as [number, number]
      );

      allLatLngs.push(...latlngs);

      setRouteG(latlngs);
    }

    if (routes.toDestination) {
      const latlngs = routes.toDestination.polyline.map(
        (coord: CoordinateDto) => [coord.lat, coord.lon] as [number, number]
      );

      allLatLngs.push(...latlngs);

      setRoute(latlngs);
    }

    if (allLatLngs.length > 0) {
      map.fitBounds(allLatLngs, {
        padding: [60, 60],
      });
    }
  }, [routes]);

  async function buscarGuinchos() {
    setLoading(true);

    let response = null;

    try {
      response = await api.get("/user/proximos");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        "Erro inesperado. Tente novamente.";

      toast.error(message);
    }

    if (response?.data) {
      setGuinchos(response.data);
    }
    setLoading(false);
  }

  async function calculateRoute(origin: Position | null, destination: string) {
    const response = await api.post("/maps/route/calculate", {
      originLat: origin?.lat,
      originLon: origin?.lon,
      destination,
    });

    const route = response.data;

    const routePositions = route.polyline.map((p: CoordinateDto) => [
      p.lat,
      p.lon,
    ]);

    const lastPoint = routePositions[routePositions.length - 1];

    setDestinationPosition({
      lat: lastPoint[0],
      lon: lastPoint[1],
    });

    setRoute(routePositions);
    setPrice(route.priceEstimate);
    setDistanceKm(route.distanceKm);
    setDurationMin(route.durationMinutes);
    const maps = mapRef.current;

    if (!maps) return;

    const bounds = L.latLngBounds(routePositions);

    maps.fitBounds(bounds, { padding: [60, 60] });
  }

  async function handleUpdateDestination() {
    if (!destinationText.trim()) {
      return;
    }
    calculateRoute(userLocation, destinationText);
  }

  return (
    <div className="page">
      <Sidebar {...sideBarProps}></Sidebar>

      <main className="map-container">
        {towTravel && (
          <TowTravelProgress status={towTravel.status}></TowTravelProgress>
        )}

        <div id="map">
          <Maps {...mapsProps}></Maps>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

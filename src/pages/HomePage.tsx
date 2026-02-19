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
import { Sidebar } from "./SideBar";
import { useLocation } from "react-router-dom";

interface CoordinateDto {
  lat: number;
  lon: number;
}

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

  const [hoveredGuinchoId, setHoveredGuinchoId] = useState<number | null>(null);

  const mapRef = useRef<L.Map | null>(null);

  const locations: MapProps = {
    motoristasPosition: guinchos,
    userPosition: userLocation,
    hoveredGuinchoId: hoveredGuinchoId,
    mapRef: mapRef,
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
      const response = await api.get("/maps/last-location");
      if (response.data) {
        setUserLocation({
          lat: response.data.latitude,
          lon: response.data.longitude,
        });
        console.dir(userLocation);
      } else {
        setUserLocation({ lat: 0, lon: 0 });
      }
    }
    loadLastLocation();
  }, []);

  useEffect(() => {
    if (userLocation && destinationPosition) {
      handleUpdateDestination();
    }
  }, [userLocation]);

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

      alert(message);
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
    
    const poly = L.polyline(routePositions, { weight: 4, opacity: 0.6 });

    maps.fitBounds(poly.getBounds(), { padding: [60, 60] });
  }

  async function handleUpdateDestination() {
    if (!destinationText.trim()) {
      return;
    }
    calculateRoute(userLocation, destinationText);
  }

  return (
    <>
      <div className="page">
        <Sidebar
          locationText={locationText}
          setLocationText={setLocationText}
          destinationText={destinationText}
          setDestinationText={setDestinationText}
          buscarGuinchos={buscarGuinchos}
          guinchos={guinchos}
          selectedGuincho={selectedGuincho}
          setSelectedGuincho={setSelectedGuincho}
          setHoveredGuinchoId={setHoveredGuinchoId}
          setUserLocation={setUserLocation}
          userLocation={userLocation}
          handleUpdateDestination={handleUpdateDestination}
          setRouteG={setRouteG}
          routeG={routeG}
          loading={loading}
          priceEstimate={priceEstimate}
          distanceKm={distanceKm}
          duration={durationMin}
          mapRef={mapRef}
          priceEstimateG={priceEstimateG}
          setPriceG={setPriceG}
          distanceKmG={distanceKmG}
          setDistanceKmG={setDistanceKmG}
          durationMinG={durationMinG}
          setDurationMinG={setDurationMinG}
          //calcularRotaComGuincho={calcularRotaComGuincho}
        ></Sidebar>

        <main className="map-container">
          <div id="map">
            <Maps
              motoristasPosition={locations.motoristasPosition}
              userPosition={locations.userPosition}
              hoveredGuinchoId={locations.hoveredGuinchoId}
              mapRef={mapRef}
              route={route}
              routeG={routeG}
              priceEstimate={priceEstimate}
              distanceKm={distanceKm}
              duration={durationMin}
              priceEstimateG={priceEstimateG}
              distanceKmG={distanceKmG}
              durationMinG={durationMinG}
            ></Maps>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;

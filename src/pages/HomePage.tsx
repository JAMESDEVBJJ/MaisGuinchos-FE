import { useEffect, useState } from "react";
import "../styles/Home.css";
import { api } from "../services/api";
import { Maps } from "./Maps";
import {
  type MapProps,
  type Position,
  type GuinchosDto,
} from "../dtos/MapPropsDTO";
import GuinchosResults from "./GuinchosResults";
import { useRef } from "react";
import L from "leaflet";

interface CoordinateDto {
  lat: number;
  lon: number;
}

const HomePage = () => {

  const [guinchos, setGuinchos] = useState<GuinchosDto[]>([]);

  const [loading, setLoading] = useState(false);

  const [userLocation, setUserLocation] = useState<Position>({
    lat: -10.3,
    lon: -53.2,
  }); // brasil ne pae
  const [locationText, setLocationText] = useState<string>("");
  const [destinationText, setDestinationText] = useState<string>("");
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [destinationPosition, setDestinationPosition] =
    useState<Position | null>(null);

  const [priceEstimate, setPrice] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0);
  const [durationMin, setDurationMin] = useState<number>(0);

  const [hoveredGuinchoId, setHoveredGuinchoId] = useState<number | null>(null);

  const COMPACT_WIDTH = 350;

  const [isCompact, setIsCompact] = useState<boolean>(false);

  const mapRef = useRef<L.Map | null>(null);

  const locations: MapProps = {
    motoristasPosition: guinchos,
    userPosition: userLocation,
    hoveredGuinchoId: hoveredGuinchoId,
    mapRef: mapRef,
    route: route,
    priceEstimate: priceEstimate,
    distanceKm: distanceKm,
    duration: durationMin
  };

  const [sidebarW, setSideBarW] = useState(360);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (userLocation && destinationPosition) {
      handleUpdateDestination();
    }
  }, [userLocation]);

  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  function handleMouseDown() {
    setIsResizing(true);
  }

  function handleMouseUp() {
    setIsResizing(false);
  }

  useEffect(() => {
    async function updateRoute() {
      if (!userLocation || !destinationPosition) return;

      const response = await api.post("/route", {
        originLat: userLocation.lat,
        originLon: userLocation.lon,
        destLat: destinationPosition.lat,
        destLon: destinationPosition.lon,
      });

      setRoute(response.data.polyline);
    }

    updateRoute();
  }, [userLocation, destinationPosition]);

  function mouseMove(e: MouseEvent) {
    if (!isResizing) return;

    const newWidth = e.clientX;

    if (newWidth <= 280) return;
    if (newWidth >= 580) return;

    setSideBarW(newWidth);
    setIsCompact(newWidth <= COMPACT_WIDTH);
  }

  async function buscarGuinchos() {
    setLoading(true);

    let response = null;

    try {
      response = await api.get("/user/proximos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  async function handleUpdateLocation() {
    if (!locationText.trim()) {
      return;
    }

    const response = await api.post(
      "/user/location",
      {
        address: locationText,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const { lat, lon } = response.data;

    const latN = Number(lat);
    const lonN = Number(lon);

    if (isNaN(latN) || isNaN(lonN)) {
      console.error("Latitude ou longitude inválidas", lat, lon);
      return;
    }

    setUserLocation({ lat: latN, lon: lonN });
  }

  async function handleUpdateDestination() {
    if (!destinationText.trim()) {
      return;
    }

    const response = await api.post(
      "/maps/route/calculate",
      {
        originLat: userLocation.lat,
        originLon: userLocation.lon,
        destination: destinationText,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const route = response.data;

    const routePositions: [number, number][] = (
      route.polyline as CoordinateDto[]
    ).map((p) => [p.lat, p.lon]);

    const lastPoint = routePositions[routePositions.length - 1];

    const destinationPosition: Position = {
      lat: lastPoint[0],
      lon: lastPoint[1],
    };
    console.dir(destinationPosition);

    setDestinationPosition(destinationPosition);
    setRoute(routePositions);
    setPrice(route.priceEstimate);
    setDistanceKm(route.distanceKm);
    setDurationMin(route.durationMinutes)
    console.dir(route)
  }

  return (
    <>
      <div className="page">
        <aside className="sidebar" style={{ width: sidebarW }}>
          <div className="search">
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
            <input
              type="text"
              placeholder="Setar destino"
              value={destinationText}
              onChange={(e) => setDestinationText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateDestination();
                }
              }}
            />
            <button onClick={buscarGuinchos}>Buscar guinchos</button>
          </div>
          {loading && (
            <>
              <h1>LOADING...</h1>
            </>
          )}

          {!loading && guinchos.length === 0 && (
            <div className="empty-state">
              <p>Digite sua localização e procure por guinchos.</p>
            </div>
          )}

          {!loading && guinchos.length >= 1 && (
            <GuinchosResults
              isCompact={isCompact}
              guinchos={guinchos}
              setHovered={setHoveredGuinchoId}
              mapRef={mapRef}
            ></GuinchosResults>
          )}

          <div className="resize-handle" onMouseDown={handleMouseDown} />
        </aside>

        <main className="map-container">
          <div id="map">
            <Maps
              motoristasPosition={locations.motoristasPosition}
              userPosition={locations.userPosition}
              hoveredGuinchoId={locations.hoveredGuinchoId}
              mapRef={mapRef}
              route={route}
              priceEstimate={priceEstimate}
              distanceKm={distanceKm}
              duration={durationMin}
            ></Maps>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;

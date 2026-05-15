import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import type { MapProps } from "../dtos/MapPropsDTO";
import iconUser from "../assets/icons/iconUser.png";
import iconGuincho from "../assets/icons/guinchoMarkup.png";
import iconGuinchoHover from "../assets/icons/guinchomarkupHoverr.png";
import destinationIcon from "../assets/icons/destinationMarkup.png";
import L from "leaflet";
import { Sun, Moon } from "lucide-react";
import { useTowTravel } from "../contexts/TowTravelContext";
import { flyToTarget } from "../utils/mapUtils";
import { useAuth } from "../contexts/AuthContext";

function MapController({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map]);

  return null;
}

export function Maps({
  motoristasPosition,
  userPosition,
  hoveredGuinchoId,
  mapRef,
  setSelectedGuincho,
  selectedGuincho,
  setDistanceKmG,
  setDurationMinG,
  setHoveredGuinchoId,
  setPriceG,
  setRequestStatus,
  setRouteG,
  route,
  routeG,
  priceEstimate,
  distanceKm,
  duration,
  priceEstimateG,
  distanceKmG,
  durationMinG,
}: MapProps) {
  const lastUserPosRef = useRef<[number, number] | null>(null);

  const { user } = useAuth();

  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(false);

  const { towTravel } = useTowTravel();

  const [isDarkTheme, setIsDark] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!userPosition) return;

    const newCenter: [number, number] = [userPosition.lat, userPosition.lon];
    if (
      !lastUserPosRef.current ||
      lastUserPosRef.current[0] !== newCenter[0] ||
      lastUserPosRef.current[1] !== newCenter[1]
    ) {
      flyToTarget(mapRef.current, newCenter[0], newCenter[1], 1);

      lastUserPosRef.current = newCenter;
    }
  }, [userPosition?.lat, userPosition?.lon]);

  const guinchoIcon = new L.Icon({
    iconUrl: iconGuincho,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const guinchoHoverIcon = new L.Icon({
    iconUrl: iconGuinchoHover,
    iconSize: [40.5, 40.5],
    iconAnchor: [20.25, 40.5],
    popupAnchor: [0, -40.5],
  });

  const userIcon = new L.Icon({
    iconUrl: iconUser,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const destinationIconMarkup = new L.Icon({
    iconUrl: destinationIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {userPosition && (
        <MapContainer
          center={[userPosition.lat, userPosition.lon]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <MapController mapRef={mapRef} />
          {isDarkTheme ? (
            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
          ) : (
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          )}
          <button
            onClick={() => setIsDark(!isDarkTheme)}
            className="map-theme-toggle"
          >
            {isDarkTheme ? (
              <Sun size={30} fill="white" color="white" />
            ) : (
              <Moon size={27} fill="black" />
            )}
          </button>
          {!towTravel &&
            motoristasPosition.map((m) => {
              const motorista = m.motorista;

              if (
                (motorista.lat === 0 && motorista.lon === 0) ||
                motorista.lon == undefined ||
                motorista.lat == undefined
              ) {
                return null;
              }

              const isHovered =
                hoveredGuinchoId === motorista.userId ||
                selectedGuincho?.motorista.userId === motorista.userId;

              return (
                <Marker
                  key={motorista.userId}
                  position={[motorista.lat, motorista.lon]}
                  icon={isHovered ? guinchoHoverIcon : guinchoIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedGuincho(m);
                      setPriceG(null);
                      setDistanceKmG(null);
                      setDurationMinG(null);
                      setRouteG(null);
                      setHoveredGuinchoId(null);
                      setRequestStatus("idle");

                      flyToTarget(
                        mapRef.current,
                        motorista.lat,
                        motorista.lon,
                        null
                      );
                    },
                  }}
                />
              );
            })}

          {user?.isDriver ? (
            <Marker
              position={[userPosition.lat, userPosition.lon]}
              icon={guinchoIcon}
            ></Marker>
          ) : (
            <Marker
              position={[userPosition.lat, userPosition.lon]}
              icon={userIcon}
            ></Marker>
          )}

          {route && (
            <>
              <Polyline
                positions={route}
                pathOptions={{
                  color: "darkorange",
                  weight: 4,
                  opacity: 0.8,
                }}
              />
              <Marker
                position={route[route.length - 1]}
                icon={destinationIconMarkup}
              ></Marker>
            </>
          )}

          {towTravel && (
            <Marker
              position={
                [towTravel.pickup.latitude, towTravel.pickup.longitude] as [
                  number,
                  number
                ]
              }
              icon={userIcon}
            ></Marker>
          )}

          {routeG && (
            <Polyline
              positions={routeG}
              pathOptions={{
                color: "yellow",
                weight: 4,
                opacity: 0.8,
              }}
            />
          )}
          {priceEstimate && !isRoutePanelOpen && !towTravel && (
            <div
              className="price-hud"
              onClick={() => setIsRoutePanelOpen(true)}
            >
              R${" "}
              {priceEstimateG
                ? (priceEstimate + priceEstimateG).toFixed(2)
                : priceEstimate.toFixed(2)}
            </div>
          )}
          {isRoutePanelOpen && !towTravel && (
            <div
              className="route-overlay"
              onClick={() => setIsRoutePanelOpen(false)}
            >
              <div className="route-panel" onClick={(e) => e.stopPropagation()}>
                <h3>Detalhes da viagem</h3>
                <p>
                  Distância:{" "}
                  {distanceKmG
                    ? (distanceKm + distanceKmG).toFixed(1)
                    : distanceKm.toFixed(1)}{" "}
                  km
                </p>
                <p>
                  Duração: {durationMinG ? duration + durationMinG : duration}{" "}
                  min
                </p>
                <p>
                  Preço estimado: R${" "}
                  {priceEstimateG
                    ? (priceEstimate + priceEstimateG).toFixed(2)
                    : priceEstimate.toFixed(2)}
                </p>

                {false && (
                  <p>
                    Preço com {}: R$ {}
                  </p>
                )}
              </div>
            </div>
          )}
        </MapContainer>
      )}
    </div>
  );
}

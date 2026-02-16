import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
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
  route,
  routeG,
  priceEstimate,
  distanceKm,
  duration,
  priceEstimateG,
  distanceKmG,
  durationMinG
}: MapProps) {
  const lastUserPosRef = useRef<[number, number] | null>(null);

  const [isRoutePanelOpen, setIsRoutePanelOpen] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const newCenter: [number, number] = [userPosition.lat, userPosition.lon];

    // só move se a posição realmente mudou
    if (
      !lastUserPosRef.current ||
      lastUserPosRef.current[0] !== newCenter[0] ||
      lastUserPosRef.current[1] !== newCenter[1]
    ) {
      mapRef.current.flyTo(newCenter, mapRef.current.getZoom(), {
        animate: true,
      });

      lastUserPosRef.current = newCenter;
    }
  }, [userPosition.lat, userPosition.lon]);

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
      <MapContainer
        center={[userPosition.lat, userPosition.lon]} // só inicial
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController mapRef={mapRef} />
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
        {motoristasPosition.map((m) => {
          const motorista = m.motorista;

          if (
            (motorista.lat === 0 && motorista.lon === 0) ||
            motorista.lon == undefined ||
            motorista.lat == undefined
          ) {
            return null;
          }

          const isHovered = hoveredGuinchoId === m.motorista.userId;

          return (
            <Marker
              key={motorista.userId}
              position={[motorista.lat, motorista.lon]}
              icon={isHovered ? guinchoHoverIcon : guinchoIcon}
            >
              <Popup>{motorista.name}</Popup>
            </Marker>
          );
        })}
        ;
        <Marker
          position={[userPosition.lat, userPosition.lon]}
          icon={userIcon}
        ></Marker>
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
        {priceEstimate && !isRoutePanelOpen && (
          <div className="price-hud" onClick={() => setIsRoutePanelOpen(true)}>
            R$ {priceEstimateG ? (priceEstimate + priceEstimateG).toFixed(2) : priceEstimate.toFixed(2)}
          </div>
        )}
        {isRoutePanelOpen && (
          <div
            className="route-overlay"
            onClick={() => setIsRoutePanelOpen(false)}
          >
            <div className="route-panel" onClick={(e) => e.stopPropagation()}>
              <h3>Detalhes da viagem</h3>
              <p>Distância: {distanceKmG ? (distanceKm + distanceKmG).toFixed(1) : distanceKm.toFixed(1)} km</p>
              <p>Duração: {durationMinG ? duration + durationMinG : duration} min</p>
              <p>Preço estimado: R$ {priceEstimateG ? (priceEstimate + priceEstimateG).toFixed(2) : priceEstimate.toFixed(2)}</p>

              {false && (
                <p>
                  Preço com {}: R$ {}
                </p>
              )}
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
}

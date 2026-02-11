import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect, useRef } from "react";
import type { MapProps } from "../dtos/MapPropsDTO";
import iconUser from "../assets/icons/iconUser.png";
import iconGuincho from "../assets/icons/guinchoMarkup.png";
import iconGuinchoHover from "../assets/icons/guinchomarkupHoverr.png";
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
}: MapProps) {
  const lastUserPosRef = useRef<[number, number] | null>(null);

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
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const guinchoHoverIcon = new L.Icon({
    iconUrl: iconGuinchoHover,
    iconSize: [45, 45],
    iconAnchor: [22.5, 45],
    popupAnchor: [0, -45],
  });

  const userIcon = new L.Icon({
    iconUrl: iconUser,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
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
          <Polyline
            positions={route}
            pathOptions={{
              color: "darkorange",
              weight: 5,
              opacity: 0.8,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

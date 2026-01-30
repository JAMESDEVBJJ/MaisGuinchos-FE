import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import type { MapProps } from "../dtos/MapPropsDTO";
import iconUser from "../assets/icons/iconUser.png";
import iconGuincho from "../assets/icons/guinchoMarkup.png";
import L from "leaflet";

type ChangeViewProps = {
  center: [number, number];
};

export function Maps({ motoristasPosition, userPosition }: MapProps) {
  console.dir(motoristasPosition);
  //const route: Position[] = [motoristasPosition[1], userPosition];

  const center: [number, number] = [
    userPosition.lat,
    userPosition.lon,
  ];

  const guinchoIcon = new L.Icon({
    iconUrl: iconGuincho,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const userIcon = new L.Icon({
    iconUrl: iconUser,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  function ChangeView({center}: ChangeViewProps) {
    const map = useMap();

    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    
    return null;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={center}></ChangeView>
        
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
        
        <Marker
          position={[userPosition.lat, userPosition.lon]}
          icon={userIcon}
        ></Marker>

        {motoristasPosition.map((m) => {
          const motorista = m.motorista;

          if (
            (motorista.lat === 0 && motorista.lon === 0) ||
            motorista.lon == undefined ||
            motorista.lat == undefined
          ) {
            return null;
          }

          return (
            <Marker
              key={motorista.userId}
              position={[motorista.lat, motorista.lon]}
              icon={guinchoIcon}
            >
              <Popup>{motorista.name}</Popup>
            </Marker>
          );
        })}
        ;
      </MapContainer>
    </div>
  );
}

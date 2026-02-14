import React, { useRef, useState } from "react";
import L from "leaflet";
import { useEffect } from "react";
import type { GuinchosDto, Position } from "../dtos/MapPropsDTO";
import { api } from "../services/api";
import iconLocation from "../assets/icons/location.png";
import iconDestination from "../assets/icons/detinIcon.png";
import GuinchosResults from "./GuinchosResults";

type SidebarProps = {
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  destinationText: string;
  setDestinationText: React.Dispatch<React.SetStateAction<string>>;
  buscarGuinchos: () => void;
  guinchos: GuinchosDto[];
  selectedGuincho: GuinchosDto | null;
  setSelectedGuincho: (g: GuinchosDto | null) => void;
  setHoveredGuinchoId: React.Dispatch<React.SetStateAction<number | null>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Position>>;
  handleUpdateDestination: () => Promise<void>;
  //calcularRotaComGuincho: () => void;
  mapRef: React.RefObject<L.Map | null>;
  loading: boolean;
  priceEstimate: number;
  distanceKm: number;
  duration: number;
};

export function Sidebar(props: SidebarProps) {
  const [locationText, setLocationText] = useState("");

  // ref pra guardar camada da rota pra poder remover depois
  const routeLayerRef = useRef<L.Layer | null>(null);

  console.dir(props.selectedGuincho?.motorista.foto);

  const COMPACT_WIDTH = 350;

  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [sidebarW, setSideBarW] = useState(360);
  const [isResizing, setIsResizing] = useState(false);
  useEffect(() => {
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

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

    props.setUserLocation({ lat: latN, lon: lonN });
  }

  function handleMouseDown() {
    setIsResizing(true);
  }

  function handleMouseUp() {
    setIsResizing(false);
  }
  function mouseMove(e: MouseEvent) {
    if (!isResizing) return;

    const newWidth = e.clientX;

    if (newWidth <= 280) return;
    if (newWidth >= 580) return;

    setSideBarW(newWidth);
    setIsCompact(newWidth <= COMPACT_WIDTH);
  }

  function handleBackToList() {
    // remove rota da tela ao voltar (opcional)
    if (routeLayerRef.current) {
      const map = props.mapRef.current;
      if (map) {
        map.removeLayer(routeLayerRef.current);
      }
      routeLayerRef.current = null;
    }

    props.setHoveredGuinchoId(null);
    props.setSelectedGuincho(null);
  }

  async function calcularRotaComGuincho() {
    if (!props.selectedGuincho) return;
    // aqui você chama seu serviço de rotas (os exemplos usam formato [lng,lat] ou [lat,lng] conforme seu provider)
    // vou usar um stub que retorna um array de coords [lat, lng].
    const origem = parseLocationToLatLng(locationText) ?? {
      lat: -27.6,
      lng: -48.5,
    }; // fallback
    //const destino = parseLocationToLatLng(destinationText) ?? {
    //  lat: selectedGuincho.motorista.lat,
    //  lng: selectedGuincho.motorista.lon,
    //};

    // substitua por fetch real para API de routing (OSRM/GraphHopper/Mapbox Directions)
    //const routeCoords: [number, number][] = await fakeRouteApi(origem, destino);

    // desenha no mapa
    const map = props.mapRef.current;
    if (!map) return;

    // remove camada anterior
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // const poly = L.polyline(routeCoords, { weight: 6, opacity: 0.9 });
    //const destMarker = L.marker([destino.lat, destino.lng]);

    // agrupa os layers para facilitar remoção
    //const group = L.layerGroup([poly, destMarker]);
    //group.addTo(map);
    //routeLayerRef.current = group;

    // ajustar bounds
    //map.fitBounds(poly.getBounds(), { padding: [60, 60] });

    // opcional: obter e mostrar infos da rota (distância / tempo)
    // você vai receber isso da sua API; aqui é só um exemplo:
    const fakeInfo = { distanciaKm: 12.4, duracaoMin: 21 };
    // mostre em UI (exibir em sidebar ou toast)
    console.log("rota calculada", fakeInfo);
  }

  return (
    <>
      <aside className="sidebar" style={{ width: sidebarW }}>
        {(props.selectedGuincho == null && (
          <div className="sidebar-1">
            {" "}
            <div className="search">
              <div className="input-wrapper">
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
                <img src={iconLocation} className="input-icon" />
              </div>

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
            {props.loading && (
              <>
                <h1>LOADING...</h1>
              </>
            )}
            {!props.loading && props.guinchos.length === 0 && (
              <div className="empty-state">
                <p>Digite sua localização e procure por guinchos.</p>
              </div>
            )}
            {!props.loading && props.guinchos.length >= 1 && (
              <GuinchosResults
                isCompact={isCompact}
                guinchos={props.guinchos}
                setHovered={props.setHoveredGuinchoId}
                mapRef={props.mapRef}
                setSelectedGuincho={props.setSelectedGuincho}
              ></GuinchosResults>
            )}
          </div>
        )) || (
          <div className="detail">
            <button className="back" onClick={handleBackToList}>
              ⬅
            </button>
            <div className="detail-top">
              <img
                className="detail-photo"
                src={`https://localhost:7120${props.selectedGuincho?.motorista.foto}` || "/icons/default-driver.png"}
                alt={props.selectedGuincho?.motorista.name}
              />
              <div className="detail-info">
                <h3>{props.selectedGuincho?.motorista.name}</h3>
                <div className="rating-row">
                  {renderStars(props.selectedGuincho?.stars)}{" "}
                  <span className="rating-number">
                    {props.selectedGuincho?.stars.toFixed(1)}
                  </span>
                </div>
                <div className="driver-data">
                  <div>{props.selectedGuincho?.motorista.number}</div>
                  <div>Modelo: {props.selectedGuincho?.model}</div>
                  <div>Placa: {props.selectedGuincho?.motorista.placa}</div>
                  <div>Cor: {props.selectedGuincho?.color}</div>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="primary fullwidth"
                onClick={calcularRotaComGuincho}
              >
                Calcular rota com guincho
              </button>
              <button
                className="secondary fullwidth"
                onClick={() => {
                  /* talvez iniciar chat, ligar */
                }}
              >
                Ligar / Contatar
              </button>
            </div>
          </div>
        )}

        <div className="resize-handle" onMouseDown={handleMouseDown} />
      </aside>
    </>
  );
}

/* helpers simples */
function renderStars(n?: number) {
  const stars = Math.round((n ?? 0) * 2) / 2; // meia estrela opcional
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  const arr = [];
  for (let i = 0; i < full; i++) arr.push("★");
  if (half) arr.push("☆"); // você pode trocar por ícone de meia
  while (arr.length < 5) arr.push("✩");
  return <span className="stars">{arr.join(" ")}</span>;
}

/* parse simples: caso você salve lat,lng no input. Troque conforme necessário */
function parseLocationToLatLng(text: string) {
  if (!text) return null;
  const parts = text.split(",").map((s) => s.trim());
  if (parts.length === 2) {
    const lat = Number(parts[0]);
    const lng = Number(parts[1]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }
  return null;
}

/* fake route API — substitua pela real */
async function fakeRouteApi(
  orig: { lat: number; lng: number },
  dest: { lat: number; lng: number }
) {
  // cria linha reta com 5 pontos entre origem -> destino
  const steps: [number, number][] = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    const lat = orig.lat + (dest.lat - orig.lat) * t;
    const lng = orig.lng + (dest.lng - orig.lng) * t;
    steps.push([lat, lng]);
  }
  // simula delay
  await new Promise((res) => setTimeout(res, 500));
  return steps;
}

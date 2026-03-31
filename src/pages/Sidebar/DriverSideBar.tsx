import { useState, useEffect } from "react";
import { InputLocation } from "./InputLocation";
import type { Position } from "../../dtos/MapPropsDTO";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import * as signalR from "@microsoft/signalr";
import { api } from "../../services/api";
import { TowRequestData } from "./TowRequestData";
import CounterOfferModal from "./CounterTowModal";

type DriverSideProps = {
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  setUserLocation: React.Dispatch<React.SetStateAction<Position | null>>;
  setRouteG: React.Dispatch<React.SetStateAction<[number, number][] | null>>;
  sideBarW: number;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DriverSideBar(props: DriverSideProps) {
  const token = localStorage.getItem("token");

  const [towsReceive, setTowsReceive] = useState<TowRequestReceiveDto[]>([]);

  const [towReceived, setTowReceived] = useState<boolean>(false);

  const [isAvailable, setIsAvailable] = useState(false);
  console.dir(towsReceive);

  const [show, setShow] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);

  const [selectedTow, setSelectedTow] = useState<TowRequestReceiveDto | null>(
    null
  );

  const initials = selectedTow?.clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const handleToggle = async () => {
    try {
      const newStatus = !isAvailable;

      await api.put("/guincho/status", {
        status: newStatus,
      });

      setIsAvailable(newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  function handleMouseDown() {
    props.setIsResizing(true);
  }

  const handleNewTow = (novoTow: TowRequestReceiveDto) => {
    setTowsReceive((prev) => [...prev, novoTow]);
  };

  useEffect(() => {
    if (!token) return;

    async function getPendingTows() {
      try {
        const response = await api.get("/towRequests/pendings");

        const towsData = response.data;

        setTowsReceive(towsData);
        setTowReceived(towsData?.length > 0);
      } catch (error) {
        console.error("Erro ao buscar pendências:", error);
        setTowsReceive([]);
        setTowReceived(false);
      }
    }

    getPendingTows();
  }, []);

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
        console.log("Conectado ao TowHub");
      } catch (err) {
        console.error("Erro ao conectar:", err);
      }
    }
    startConnection();

    connection.on("ReceiveTowRequest", (data) => {
      handleNewTow(data);
      setTowReceived(true);
    });

    connection.on("CounterOfferRejected", (data: TowRequestReceiveDto) => {
      setTowsReceive((prev) =>
        prev.map((t) =>
          t.id === data.id ? { ...t, counterOfferRecused: true } : t
        )
      );
    });

    return () => {
      connection.stop();
    };
  }, []);

  const buttonCounterText = () => {
    if (selectedTow?.counterOfferRecused) {
      return "Contraproposta recusada.";
    }
  };

  const buttonCounterClass = () => {
    if (selectedTow?.counterOfferRecused)
      return "secondary fullwidth disabled";

    return `counter-btn sendButton  fullwidth  ${
      selectedTow?.status === 2 && "success"
    }`;
  };

  return (
    <>
      <aside className="sidebar" style={{ width: props.sideBarW }}>
        {!selectedTow && (
          <>
            <div className="sidebar-header">
              <span className="status-label">
                {isAvailable ? "Disponível" : "Indisponível"}
              </span>

              <div
                className={`toggle ${isAvailable ? "active" : ""}`}
                onClick={handleToggle}
              >
                <div className="toggle-circle" />
              </div>
            </div>
            <div className="search">
              <InputLocation
                locationText={props.locationText}
                setLocationText={props.setLocationText}
                setRouteG={props.setRouteG}
                setUserLocation={props.setUserLocation}
              />
            </div>

            {towReceived && towsReceive.length > 0 && (
              <>
                <span className="results-title">Pedidos de reboque</span>

                <div className="results">
                  {towsReceive.map((t) => {
                    const firstName = t.clientName.split(" ")[0];

                    return (
                      <div
                        key={t.id}
                        className="result-card driver-card"
                        onClick={() => setSelectedTow(t)}
                      >
                        <div className="card-main">
                          <div className="left">
                            <span className="client-name">{firstName}</span>
                            <span className="distance">
                              {t.totalDistanceKm}km
                            </span>
                            <span className="duration">
                              há {formatTime(getMinutesSince(t.createdAt))}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
        {selectedTow && (
          <div className="tow-details">
            <button className="back" onClick={() => setSelectedTow(null)}>
              ⬅
            </button>

            <h3 className="solicith3">Solicitação de serviço</h3>

            <div className="detail-top">
              <h3>{selectedTow.clientName}</h3>
              <div className="detail-info">
                <div className="client-data">
                  <span className="phone">+55 48 9 8832-2133</span>
                </div>
              </div>
            </div>
            <div className="detail">
              <TowRequestData
                distanceKm={selectedTow.totalDistanceKm}
                durationMin={selectedTow.durationMinutes}
                priceEstimate={selectedTow.suggestedPrice}
                distanceKmG={selectedTow.totalDistanceKm}
                durationMinG={selectedTow.durationMinutes}
                priceEstimateG={selectedTow.suggestedPrice}
                suggestedPrice={selectedTow.suggestedPrice}
                routeG={null}
                modelo={selectedTow.vehicleType}
                totalDistanceKm={selectedTow.totalDistanceKm}
              />
            </div>

            <div className="tow-extra">
              <p>Questão: {selectedTow.vehicleIssue}</p>

              <p>Notas: {selectedTow.notes}</p>
            </div>

            {(selectedTow.status !== 2 || selectedTow.counterOfferRecused) && (
              <button className="accept-btn">Aceitar</button>
            )}

            <button
              className={buttonCounterClass()}
              onClick={() => setShowCounterModal(!showCounterModal)}
              disabled={selectedTow.status === 2 || selectedTow.counterOfferRecused}
            >
              {selectedTow.counterOfferRecused
                ? "Countra proposta recusada!"
                : selectedTow.status !== 2
                ? "Enviar contraproposta"
                : selectedTow.status === 2
                ? "Contraproposta enviada!"
                : ""}
            </button>
          </div>
        )}
        <div className="resize-handle" onMouseDown={handleMouseDown} />
      </aside>
      {showCounterModal && selectedTow !== null && (
        <CounterOfferModal
          price={selectedTow.suggestedPrice}
          onClose={() => {
            setShowCounterModal(false);
          }}
          setSelectedTow={setSelectedTow}
          towRequest={selectedTow}
          setTowsReceived={setTowsReceive}
        />
      )}
    </>
  );
}
function formatTime(minutes: number) {
  const totalSeconds = minutes * 60;

  if (totalSeconds < 60) {
    return `${Math.floor(totalSeconds)}s`;
  }

  if (minutes < 60) {
    return `${Math.floor(minutes)}min`;
  }

  const hours = minutes / 60;

  if (hours >= 24) {
    return `${(hours / 24).toFixed(1)}d`;
  }

  return `${hours.toFixed(1)}h`;
}

function getMinutesSince(dateValue: string | number | Date) {
  const created = new Date(dateValue).getTime();
  const now = Date.now();

  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);

  return diffMinutes;
}

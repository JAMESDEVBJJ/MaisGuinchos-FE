import { useState, useEffect } from "react";
import { InputLocation } from "./InputLocation";
import type { Position } from "../../dtos/MapPropsDTO";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import * as signalR from "@microsoft/signalr";
import { api } from "../../services/api";

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
    console.dir(towsReceive);
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

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <aside className="sidebar" style={{ width: props.sideBarW }}>
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
                <div key={t.id} className="result-card driver-card">
                  <div className="card-main">
                    <div className="left">
                      <span className="client-name">{firstName}</span>

                      <span className="distance">{t.totalDistanceKm}km</span>

                      <span className="duration">
                        há {formatDuration(t.durationMinutes)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div className="resize-handle" onMouseDown={handleMouseDown} />
    </aside>
  );
}

function formatDuration(minutes: number) {
  const totalSeconds = minutes * 60;

  if (totalSeconds < 60) {
    return `${Math.floor(totalSeconds)}s`;
  }

  if (minutes < 60) {
    return `${Math.floor(minutes)}min`;
  }

  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}

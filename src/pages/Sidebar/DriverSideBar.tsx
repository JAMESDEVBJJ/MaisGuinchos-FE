import { useState, useEffect } from "react";
import { InputLocation } from "./InputLocation";
import type { Position } from "../../dtos/MapPropsDTO";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import * as signalR from "@microsoft/signalr";

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

  function handleMouseDown() {
    props.setIsResizing(true);
  }

  const handleNewTow = (novoTow: TowRequestReceiveDto) => {
    setTowsReceive((prev) => [...prev, novoTow]);
    console.dir(towsReceive);
  };

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
  }, [token]);

  return (
    <aside className="sidebar" style={{ width: props.sideBarW }}>
      <div className="search">
        <InputLocation
          locationText={props.locationText}
          setLocationText={props.setLocationText}
          setRouteG={props.setRouteG}
          setUserLocation={props.setUserLocation}
        />
        {towReceived && (
          <div className="results">
            {towsReceive.map((t) => (
              <div className="result-card">
                {t.totalDistanceKm}Kms {t.suggestedPrice}R$
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="resize-handle" onMouseDown={handleMouseDown} />
    </aside>
  );
}

import { useState } from "react";
import "../styles/Home.css";
import { api } from "../services/api";
import { Maps } from "./Maps";
import {
  type MapProps,
  type Position,
  type GuinchosDto,
} from "../dtos/MapPropsDTO";
import GuinchosResults from "./GuinchosResults";

const HomePage = () => {
  const [guinchos, setGuinchos] = useState<GuinchosDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Position>({
    lat: -10.3,
    lon: -53.2,
  });
  //const [userData, setUserData] = useState<UserDto>({userPosition: });
  const [locationText, setLocationText] = useState<string>("");

  const locations: MapProps = {
    motoristasPosition: guinchos,
    userPosition: userLocation,
  };

  async function buscarGuinchos() {
    setLoading(true);

    const response = await api.get("/user/proximos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log(localStorage.getItem("token"));

    if (response.data) {
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

    const { lat, lon} = response.data;

    console.dir(response.data)
    const latN = Number(lat);
    const lonN = Number(lon);

    if (isNaN(latN) || isNaN(lonN)) {
      console.error("Latitude ou longitude inválidas", lat, lon);
      return;
    }

    setUserLocation({ lat: latN, lon: lonN });
  }

  return (
    <>
      <div className="page">

        <aside className="sidebar">

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
            <button onClick={buscarGuinchos}>Buscar guinchos</button>
          </div>
          {loading && (
            <>
              <h1>LOADING...</h1>
            </>
          )}

          {!loading && guinchos.length === 0 && <>Nenhum guincho encontrado.</>}

          {!loading && guinchos.length >= 1 && (
            <GuinchosResults guinchos={guinchos}></GuinchosResults>
          )}
        </aside>

        <main className="map-container">
          <div id="map">
            <Maps
              motoristasPosition={locations.motoristasPosition}
              userPosition={locations.userPosition}
            ></Maps>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;

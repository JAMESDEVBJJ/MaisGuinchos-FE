import { api } from "../../services/api";
import iconLocation from "../../assets/icons/location.png";

type InputLocationProps = {
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  setRouteG: React.Dispatch<React.SetStateAction<any>>;
  setUserLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lon: number } | null>
  >;
};

export function InputLocation({
  locationText,
  setLocationText,
  setRouteG,
  setUserLocation,
}: InputLocationProps) {
  async function handleUpdateLocation() {
    if (!locationText.trim()) {
      return;
    }

    const response = await api.post("/user/location", {
      address: locationText,
    });

    const { lat, lon } = response.data;

    const latN = Number(lat);
    const lonN = Number(lon);

    if (isNaN(latN) || isNaN(lonN)) {
      console.error("Latitude ou longitude inválidas", lat, lon);
      return;
    }

    setRouteG(null);
    setUserLocation({ lat: latN, lon: lonN });
  }

  return (
    <div className="input-wrapper setarLocInput-wrapper">
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
  );
}

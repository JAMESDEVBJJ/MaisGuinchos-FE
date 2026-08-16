import { Car } from "lucide-react";
import "../../styles/VehicleInfo.css";

interface VehicleInfoProps {
    model: string;
    plate: string;
    color: string;
}

export default function VehicleInfo({ model, plate, color }: VehicleInfoProps) {
    return (
        <div className="vehicle-info">
            <p className="vehicle-info__title">Veículo</p>
            <div className="vehicle-info__main">
                <Car className="vehicle-info__icon" />
                <div className="vehicle-info__details">
                    <h3 className="vehicle-info__model">{model}</h3>
                    <p className="vehicle-info__plate">{plate}</p>
                    <p className="vehicle-info__color">Cor: {color}</p>
                </div>
            </div>
        </div>
    );
}
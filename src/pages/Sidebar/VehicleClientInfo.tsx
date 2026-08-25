import { Car } from "lucide-react";
import "../../styles/VehicleInfo.css";

interface VehicleClientInfoProps {
    model: string;
    question: string;
    notes?: string;
}

export default function VehicleClientInfo({ model, question, notes }: VehicleClientInfoProps) {
    return (
        <div className="vehicle-info ">
            <p className="vehicle-info__title">Questão do veículo</p>
            <div className="vehicle-info__main">
                <Car className="vehicle-info__icon" />
                <div className="vehicle-info__details">
                    <h3 className="vehicle-info__model">Modelo: {model}</h3>
                    <p className="vehicle-info__plate">Questão: {question}</p>
                    {notes && <p className="vehicle-info__notes">Observações: {notes}</p>}
                </div>
            </div>
        </div>
    );
}
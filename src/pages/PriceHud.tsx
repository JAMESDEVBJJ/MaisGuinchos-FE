import { Ticket, ChevronDown } from "lucide-react";

interface PriceHudProps {
    price: number;
    onClick: () => void;
}


export default function PriceHud({ price, onClick }: PriceHudProps) {
    return (
        <div className="price-hud" onClick={onClick}>
            <div className="price-hud-content">
                <Ticket size={18} className="price-hud-icon" />
                <span className="price-hud-value">R$ {price.toFixed(2)}</span>
            </div>
            <ChevronDown size={14} className="price-hud-chevron" />
        </div>
    );
}
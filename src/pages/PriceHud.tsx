import { Coins, ChevronDown } from "lucide-react";

interface PriceHudProps {
  price: number;
  onClick: () => void;
  isOpen?: boolean;
}

export default function PriceHud({
  price,
  onClick,
  isOpen = false,
}: PriceHudProps) {
  return (
    <button
      type="button"
      className={`price-hud ${isOpen ? "price-hud--open" : ""}`}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={`Preço estimado R$ ${price.toFixed(2)}. Ver detalhes.`}
    >
      <span className="price-hud-icon">
        <Coins size={16} strokeWidth={2.5} />
      </span>

      <span className="price-hud-value">R$ {price.toFixed(2)}</span>

      <ChevronDown size={15} strokeWidth={2.25} className="price-hud-chevron" />
    </button>
  );
}

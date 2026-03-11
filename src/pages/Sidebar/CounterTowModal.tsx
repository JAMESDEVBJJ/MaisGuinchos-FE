import { useState } from "react";
import "../../styles/CounterTowModalCss.css";

const reasons = [
  "Veículo sem pneus",
  "Garagem apertada",
  "Terreno irregular",
  "Acesso difícil",
  "Outro",
];

type CounterOfferModalProps = {
  price: number;
  onClose: () => void;
};

export default function CounterOfferModal({
  price,
  onClose,
}: CounterOfferModalProps) {
  const [percent, setPercent] = useState(5);
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [reasonsSelected, setReasonsSelected] = useState<string[]>([]);

  const newPrice = price * (1 + percent / 100);

  function toggleReason(r: string) {
    if (reasonsSelected.includes(r)) {
      setReasonsSelected(reasonsSelected.filter((x) => x !== r));
    } else {
      setReasonsSelected([...reasonsSelected, r]);
    }
  }

  function submit() {
    let finalReasons = [...reasonsSelected];

    if (reasonsSelected.includes("Outro") && customReason) {
      finalReasons = finalReasons.filter((r) => r !== "Outro");
      finalReasons.push(customReason);
    }

    const reasonString = finalReasons.join(", ");

    if (!reasonString) {
      alert("Informe ao menos um motivo");
      return;
    }

    console.log({
      percent,
      newPrice,
      reason: reasonString,
    });
  }

  return (
    <div className="modalOverlay">
      <div className="modalCard">
        <button className="close" onClick={onClose}>
          ✕
        </button>
        <div className="priceSection">
          <span className="oldPrice">
            R${" "}
            {price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          <h2 className="newPrice">
            R${" "}
            {newPrice.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <span className="percent">+{percent}%</span>
        </div>

        <div className="sliderSection">
          <input
            type="range"
            min="0"
            max="15"
            value={percent}
            style={
              {
                "--progress": `${(percent / 15) * 100}%`,
              } as React.CSSProperties
            }
            onChange={(e) => setPercent(Number(e.target.value))}
          />
        </div>

        <div className="reasons">
          <p className="label">Motivo:</p>

          <div className="reasonButtons">
            {reasons.map((r) => (
              <button
                key={r}
                className={`reasonButton ${
                  reasonsSelected.includes(r) ? "active" : ""
                }`}
                onClick={() => toggleReason(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {reasonsSelected.includes("Outro") && (
          <input
            className="customReason"
            placeholder="Descreva o motivo"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        <button className="sendButton" onClick={submit}>
          Enviar contraproposta
        </button>
      </div>
    </div>
  );
}

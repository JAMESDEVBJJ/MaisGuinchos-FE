import { useState } from "react";
import "../../styles/CounterTowModalCss.css";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import { api } from "../../services/api";

const reasons = [
  "Veículo sem pneus",
  "Garagem apertada",
  "Terreno irregular",
  "Acesso difícil",
  "Veículo pesado",
  "Rua inclinada",
  "Risco de danos",
  "Outro",
];

type CounterOfferModalProps = {
  price: number;
  onClose: () => void;
  towRequest: TowRequestReceiveDto;
};

export interface TowRequestCounterOfferDto {
  towRequestId: string;
  newPrice: number;
  initialPrice: number;
  percent: number;
  reason?: string;
}

export default function CounterOfferModal({
  price,
  onClose,
  towRequest,
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

    let reasonString = finalReasons.join(", ");

    if (!reasonString) {
      alert("Informe ao menos um motivo");
      return;
    }

    if (reasonString[reasonString.length - 1] !== ".") {
      reasonString += ".";
    }

    setReason(reasonString);

    api.put(`/towRequests/${towRequest.id}/counter-offer`, {
      newPrice: newPrice,
      initialPrice: price,
      percent: percent,
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
            min="1"
            max="15"
            value={percent}
            style={
              {
                "--progress": `${((percent - 1) / (15 - 1)) * 100}%`,
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
          <div className="field">
            <input
              className="customReason"
              placeholder="Descreva o motivo"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          </div>
        )}

        <button className="sendButton" onClick={submit}>
          Enviar contraproposta
        </button>
      </div>
    </div>
  );
}

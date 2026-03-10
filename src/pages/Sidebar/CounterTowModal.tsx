import { useState } from "react";

const reasons = [
  "Veículo sem pneus",
  "Garagem apertada",
  "Terreno irregular",
  "Acesso difícil",
  "Outro"
];

type CounterOfferModalProps = {
    price: number
    onClose: () => void
  }

export default function CounterOfferModal({price, onClose}: CounterOfferModalProps) {

  const [percent,setPercent] = useState(5);
  const [reason,setReason] = useState("");
  const [customReason,setCustomReason] = useState("");

  const newPrice = (price * (1 + percent/100)).toFixed(2);

  function submit(){

    const finalReason =
      reason === "Outro" ? customReason : reason;

    console.log({
      percent,
      newPrice,
      reason: finalReason
    });

  }

  return (

    <div className="modalOverlay">

      <div className="modalCard">

        <h2>R$ {newPrice}</h2>

        <p>+{percent}%</p>

        <input
          type="range"
          min="0"
          max="10"
          value={percent}
          onChange={(e)=>setPercent(Number(e.target.value))}
        />

        <div className="reasons">

          {reasons.map(r=>(
            <button
              key={r}
              className={reason===r ? "active":""}
              onClick={()=>setReason(r)}
            >
              {r}
            </button>
          ))}

        </div>

        {reason==="Outro" && (

          <input
            placeholder="Descreva o motivo"
            value={customReason}
            onChange={(e)=>setCustomReason(e.target.value)}
          />

        )}

        <button className="sendButton" onClick={submit}>
          Enviar contraproposta
        </button>

        <button className="closeButton" onClick={onClose}>
          fechar
        </button>

      </div>

    </div>
  );
}
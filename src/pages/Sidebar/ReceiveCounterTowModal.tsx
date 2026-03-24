import type { PutTowCounterOfferDTO } from "../../dtos/CounterOfferDTO";
import "../../styles/ConterOfferModals/ReceiveCounterTowModal.css";

type GetCounterOfferModalProps = {
  onClose: () => void;
  towCounterReceived: PutTowCounterOfferDTO | null;
};

export default function ReceiveCounterTowModal({
  ...props
}: GetCounterOfferModalProps) {
  function submit() {}

  function cancel() {}

  return (
    <div className="modalOverlay">
      <div className="modalCard">
        <button className="close" onClick={props.onClose}>
          ✕
        </button>
        <div className="priceSection">
          <span className="oldPrice">
            R${" "}
            {props.towCounterReceived?.suggestedPrice.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>

          <h2 className="newPrice">
            R${" "}
            {props.towCounterReceived?.counterOfferPrice!.toLocaleString(
              "pt-BR",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </h2>
        </div>
        <div className="reasons">
          <p className="label motivo-client">Motivo:</p>
        </div>
        <div className="field">
          <textarea value={props.towCounterReceived?.counterOfferReason} />
        </div>

        <button
          className={`secondary fullwidth ${"contact-enabled"}`}
          onClick={submit}
        >
          Aceitar
        </button>

        <button className="sendButton" onClick={cancel}>
          Recusar (manter anterior)
        </button>
      </div>
    </div>
  );
}

import { useTowTravel } from "../../contexts/TowTravelContext";
import type { AcceptTowRequestResponseDTO } from "../../dtos/AcceptTowRequestResponseDTO";
import type { TowRequestDTO } from "../../dtos/TowRequestDTO";
import type { TowTravelDTO } from "../../dtos/TowTravelDTO";
import { api } from "../../services/api";
import "../../styles/ConterOfferModals/ReceiveCounterTowModal.css";

type GetCounterOfferModalProps = {
  onClose: () => void;
  towCounterReceived: TowRequestDTO | null;
  setShowGetCounterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestStatus: React.Dispatch<
    React.SetStateAction<
      | "idle"
      | "sending"
      | "waitingDriver"
      | "accepted"
      | "counterOfferReceived"
      | "counterOfferRejected"
    >
  >;
};

export default function ReceiveCounterTowModal({
  ...props
}: GetCounterOfferModalProps) {
  const { setTowTravel } = useTowTravel();

  async function submit() {
    try {
      if (!props.towCounterReceived?.id) return;

      const response = await api.post(
        `towrequests/${props.towCounterReceived.id}/accept-counter-offer`
      );

      const data: AcceptTowRequestResponseDTO = response.data;

      const towTravel: TowTravelDTO = {
        towRequestId: data.towRequestId,
        id: data.towTravelId,
        driverId: data.towDriverId,
        finalPrice: data.finalPrice,

        distanceToPickupKm: data.distanceToPickupKm,
        timeToPickupMin: data.durationMinToPickup,

        distanceToDestinationKm: data.distanceToDestinationKm,
        timeToDestinationMin: data.durationMinToDestination,
        status: 0,
      };

      setTowTravel(towTravel);
      props.setRequestStatus("accepted");

    } catch (error) {
      const message = "Erro ao aceitar contraproposta.";

      console.error(message, error);

      alert(message);
    }
  }

  async function cancel() {
    try {
      if (!props.towCounterReceived?.id) return;

      const response = await api.put(
        `/towRequests/${props.towCounterReceived.id}/reject-counter-offer`
      );

      const { status } = response.data;

      console.log(status);

      props.setShowGetCounterModal(false);
      props.setRequestStatus("counterOfferRejected");

      console.log("envio e termino");
    } catch (error) {
      const message = "Erro ao rejeitar contraproposta.";

      console.error(message, error);

      alert(message);
    }
  }

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

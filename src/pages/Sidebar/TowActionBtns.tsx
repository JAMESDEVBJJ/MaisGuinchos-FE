import React from "react";
import { TowRequestStatus } from "../../utils/towsRequestsUtils";
import "../../styles/TowActionsBtns.css";

interface TowActionButtonsProps {
    status: TowRequestStatus;
    counterOfferRecused?: boolean;
    onAccept: () => void;
    onCounterOffer: () => void;
    onReject: () => void;
}

function getCounterOfferLabel(
    status: TowRequestStatus,
    counterOfferRecused?: boolean
): string {
    if (status === TowRequestStatus.CounterOfferRejected) {
        return "Contra proposta recusada!";
    }
    if (status === TowRequestStatus.WaitingDriverResponse) {
        return "Fazer Contraproposta";
    }
    if (status === TowRequestStatus.CounterOfferSent) {
        return "Contraproposta enviada!";
    }
    return "Fazer Contraproposta";
}

export function TowActionButtons({
    status,
    counterOfferRecused,
    onAccept,
    onCounterOffer,
    onReject,
}: TowActionButtonsProps) {
    const showAccept = status !== TowRequestStatus.CounterOfferSent || counterOfferRecused;
    const showCounterOffer = status !== TowRequestStatus.Accepted;
    const showReject =
        status === TowRequestStatus.WaitingDriverResponse ||
        status === TowRequestStatus.CounterOfferSent ||
        status === TowRequestStatus.CounterOfferRejected;

    const counterOfferDisabled =
        status === TowRequestStatus.CounterOfferRejected || counterOfferRecused;

    return (
        <div className="tow-action-buttons">
            {showAccept && (
                <button
                    type="button"
                    className={`tow-btn tow-btn--accept ${status === TowRequestStatus.Accepted ? "tow-btn--accepted" : ""
                        }`}
                    onClick={onAccept}
                    disabled={status === TowRequestStatus.Accepted}
                >
                    {status === TowRequestStatus.Accepted
                        ? "Solicitação aceita!"
                        : "Aceitar Solicitação"}
                </button>
            )}

            {showCounterOffer && (
                <button
                    type="button"
                    className="tow-btn tow-btn--counter"
                    onClick={onCounterOffer}
                    disabled={counterOfferDisabled}
                >
                    {getCounterOfferLabel(status, counterOfferRecused)}
                </button>
            )}

            {showReject && (
                <button
                    type="button"
                    className="tow-btn tow-btn--reject"
                    onClick={onReject}
                >
                    Recusar
                </button>
            )}
        </div>
    );
}
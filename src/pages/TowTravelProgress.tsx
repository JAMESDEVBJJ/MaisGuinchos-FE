import { TowTravelStatus } from "../utils/enums/TowTravelStatus";
import "../styles/TowTravelProgress.css";

type Props = {
  status?: TowTravelStatus;
};

export function TowTravelProgress({ status }: Props) {
  const steps = [
    TowTravelStatus.GoingToClient,
    TowTravelStatus.ArrivedAtPickup,
    TowTravelStatus.InProgress,
    TowTravelStatus.ArrivedAtDestination, 
  ];

  return (
    <div className="travel-progress">
      {steps.map((step, index) => {
        const isCompleted = status! > step;
        const isCurrent = status === step;

        return (
          <div key={step} className="progress-step-wrapper">
            <div
              className={`
                  progress-step
                  ${isCompleted ? "completed" : ""}
                  ${isCurrent ? "current" : ""}
                `}
            />

            {index < steps.length - 1 && (
              <div
                className={`
                    progress-line
                    ${status! > step ? "completed" : ""}
                  `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

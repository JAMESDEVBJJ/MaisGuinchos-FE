import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import type { AcceptTowRequestResponseDTO } from "../dtos/AcceptTowRequestResponseDTO";
import { TowTravelStatus } from "../utils/enums/TowTravelStatus";

type TowTravel = AcceptTowRequestResponseDTO;

type TowTravelContextType = {
  towTravel: TowTravel | null;
  setTowTravel: React.Dispatch<React.SetStateAction<TowTravel | null>>;
  towTravelStatus: TowTravelStatus | null;
  setTowTravelStatus: React.Dispatch<
    React.SetStateAction<TowTravelStatus | null>
  >;
  remainingDistance: number | null;
  setRemainingDistance: React.Dispatch<React.SetStateAction<number | null>>;
  remainingTime: number | null;
  setRemainingTime: React.Dispatch<React.SetStateAction<number | null>>;
  clearTowTravel: () => void;
};

const TowTravelContext = createContext<TowTravelContextType | undefined>(
  undefined
);

export function TowTravelProvider({ children }: { children: ReactNode }) {
  const [towTravel, setTowTravel] = useState<TowTravel | null>(null);
  const [towTravelStatus, setTowTravelStatus] =
    useState<TowTravelStatus | null>(null);

  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [remainingDistance, setRemainingDistance] = useState<number | null>(
    null
  );

  function clearTowTravel() {
    setTowTravel(null);
  }

  return (
    <TowTravelContext.Provider
      value={{
        towTravel,
        setTowTravel,
        towTravelStatus,
        setTowTravelStatus,
        clearTowTravel,
        remainingTime,
        setRemainingTime,
        remainingDistance,
        setRemainingDistance,
      }}
    >
      {children}
    </TowTravelContext.Provider>
  );
}

export function useTowTravel() {
  const context = useContext(TowTravelContext);

  if (!context) {
    throw new Error("useTowTravel must be used within a TowTravelProvider");
  }

  return context;
}

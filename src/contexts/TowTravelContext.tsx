import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

import { TowTravelStatus } from "../utils/enums/TowTravelStatus";
import type { TowTravelDTO } from "../dtos/TowTravelDTO";

type TowTravel = TowTravelDTO;

type TowTravelContextType = {
  towTravel: TowTravel | null;
  setTowTravel: React.Dispatch<React.SetStateAction<TowTravel | null>>;
  towTravelStatus: TowTravelStatus | null;
  setTowTravelStatus: React.Dispatch<
    React.SetStateAction<TowTravelStatus | null>
  >;
  clearTowTravel: () => void;
};

const TowTravelContext = createContext<TowTravelContextType | undefined>(
  undefined
);

export function TowTravelProvider({ children }: { children: ReactNode }) {
  const [towTravel, setTowTravel] = useState<TowTravel | null>(null);
  const [towTravelStatus, setTowTravelStatus] =
    useState<TowTravelStatus | null>(null);

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

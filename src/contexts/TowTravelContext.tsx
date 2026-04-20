import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';

import type { AcceptTowRequestResponseDTO } from "../dtos/AcceptTowRequestResponseDTO";

type TowTravel = AcceptTowRequestResponseDTO;

type TowTravelContextType = {
  towTravel: TowTravel | null;
  setTowTravel: React.Dispatch<React.SetStateAction<TowTravel | null>>;
  clearTowTravel: () => void;
};

const TowTravelContext = createContext<TowTravelContextType | undefined>(
  undefined
);

export function TowTravelProvider({ children }: { children: ReactNode }) {
  const [towTravel, setTowTravel] = useState<TowTravel | null>(null);

  function clearTowTravel() {
    setTowTravel(null);
  }

  return (
    <TowTravelContext.Provider value={{ towTravel, setTowTravel, clearTowTravel }}>
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
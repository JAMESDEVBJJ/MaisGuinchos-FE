import { createContext, useContext } from "react";
import type { TowRequestReceiveDto } from "../dtos/TowRequestReceiveDTO";

type TowRequestContextType = {
  activeTowsRequests: TowRequestReceiveDto[];
  setActiveTowsRequests: React.Dispatch<
    React.SetStateAction<TowRequestReceiveDto[]>
  >;
  hasActive: boolean;
};

export const TowRequestContext = createContext<
  TowRequestContextType | undefined
>(undefined);

export function useTowRequest() {
  const context = useContext(TowRequestContext);

  if (!context) {
    throw new Error("useTowRequest deve ser usado dentro do Provider");
  }

  return context;
}
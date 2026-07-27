import { useEffect, useState } from "react";
import { TowRequestContext } from "../TowRequestsContext";
import { api } from "../../services/api";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";

export function TowRequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTowsRequests, setActiveTowsRequests] = useState<TowRequestReceiveDto[]>([]);

  useEffect(() => {
    async function loadActiveTows() {
      try {
        const response = await api.get("/towRequests/my-actives");
        setActiveTowsRequests(response.data);
      } catch (error) {
        console.error(error);
        setActiveTowsRequests([]);
      }
    }

    loadActiveTows();
  }, []);
  const hasActive = activeTowsRequests.length > 0;
  return (
    <TowRequestContext.Provider
      value={{
        activeTowsRequests,
        setActiveTowsRequests,
        hasActive
      }}
    >
      {children}
    </TowRequestContext.Provider>
  );
}

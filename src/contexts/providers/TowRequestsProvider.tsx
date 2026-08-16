import { useEffect, useState } from "react";
import { TowRequestContext } from "../TowRequestsContext";
import { api } from "../../services/api";
import type { TowRequestReceiveDto } from "../../dtos/TowRequestReceiveDTO";
import { useAuth } from "../AuthContext";

export function TowRequestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeTowsRequests, setActiveTowsRequests] = useState<TowRequestReceiveDto[]>([]);
  const { user } = useAuth();

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

    if (user?.isClient) {
      loadActiveTows();
    }
  }, [user]);
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

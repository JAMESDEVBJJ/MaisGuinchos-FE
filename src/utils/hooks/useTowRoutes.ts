import { useEffect, useState } from "react";
import type { TowTravelDTO } from "../../dtos/TowTravelDTO";
import { TowTravelStatus } from "../enums/TowTravelStatus";
import { api } from "../../services/api";
import type { LocationDTO } from "../../dtos/towTravel/TowTravelResponseDTO";
import { useTowTravel } from "../../contexts/TowTravelContext";

export function useTowRoutes(towTravel: TowTravelDTO | null) {
  let { routes, setRoutes } = useTowTravel();

  useEffect(() => {
    if (!towTravel) return;

    async function fetchRoutes() {
      try {
        var driverLocation = await api.get(
          `/maps/last-location/${towTravel!.driverId}`
        );

        let driverLocData: LocationDTO = driverLocation.data;
        if (towTravel!.status === TowTravelStatus.GoingToClient) {
          const responseToPickup = await api.post("/maps/route/calculate", {
            originLat: driverLocData.latitude,
            originLon: driverLocData.longitude,
            destinationLat: towTravel!.pickup.latitude,
            destinationLon: towTravel!.pickup.longitude,
          });

          const responseToDestination = await api.post(
            "/maps/route/calculate",
            {
              originLat: towTravel!.pickup.latitude,
              originLon: towTravel!.pickup.longitude,
              destinationLat: towTravel!.destination.latitude,
              destinationLon: towTravel!.destination.longitude,
            }
          );

          setRoutes({
            toPickup: responseToPickup.data,
            toDestination: responseToDestination.data,
          });

          console.dir({
            toPickup: responseToPickup.data,
            toDestination: responseToDestination.data,
          });
        }

        if (towTravel!.status === TowTravelStatus.InProgress) {
          var responseToDestination = await api.post("/maps/route/calculate", {
            originLat: driverLocData.latitude,
            originLon: driverLocData.longitude,
            destinationLat: towTravel!.destination.latitude,
            destinationLon: towTravel!.destination.longitude,
          });

          setRoutes({
            toDestination: responseToDestination.data,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar rota", err);
      }
    }

    fetchRoutes();
  }, [towTravel]);

  return { routes };
}

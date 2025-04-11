import { Button, Grid, MenuItem, Select, styled } from "@mui/material";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Route } from "../util/models";
import { Loader } from "google-maps";
import { getCurrentPosition } from "../util/geolocation";
import { makeCarIcon, makeMarkerIcon, Map } from "../util/map";
import { sample, shuffle } from "lodash";
import { RouteExistsError } from "../error/route-exists.error";
import { useSnackbar } from "notistack";
import { Navbar } from "./navbar";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL as string;
const googleMapsLoader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

const btnSubmitWrapper = styled("div")({
  textAlign: "center",
  marginTop: "8px",
});

const container = styled("div")({
  textAlign: "center",
  marginTop: "8px",
});

const root = styled("div")({
  width: "100%",
  height: "100%",
});

const form = styled("form")({
  margin: "16px",
});

const map = styled("div")({
  width: "100%",
  height: "100%",
});

export const Mapping = () => {
  const classes = { btnSubmitWrapper, root, form, map, container };
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");
  const mapRef = useRef<Map>(null);
  const socketIORef = useRef<Socket | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const finishRout = useCallback(
    (route: Route) => {
      enqueueSnackbar(`${route.title} finalizou`, {
        variant: "success",
      });
      mapRef.current?.removeRoute(route._id);
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    if (!socketIORef.current?.connected) {
      socketIORef.current = io(`${API_URL}/routes`);
      socketIORef.current.on("connect", () => console.log("conectou"));
    }

    const handler = (data: {
      routeId: string;
      position: [number, number];
      finished: boolean;
    }) => {
      console.log(data);
      mapRef.current?.moveCurrentMarker(data.routeId, {
        lat: data.position[0],
        lng: data.position[1],
      });

      const route = routes.find((route) => route._id === data.routeId) as Route;
      if (data.finished) {
        finishRout(route);
      }
    };
    socketIORef.current?.on("new-position", handler);
    return () => {
      socketIORef.current?.off("new-position", handler);
    };
  }, [finishRout, routes, routeIdSelected]);

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((response) => response.json())
      .then((data) => setRoutes(data))
      .catch((error) => console.error("Error fetching routes:", error));
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);

      const divMap = document.getElementById("map") as HTMLElement;
      mapRef.current = new Map(divMap, {
        zoom: 15,
        center: position,
      });
    })();
  }, []);

  const startRoute = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const route = routes.find((route) => route._id === routeIdSelected);
      const color = sample(shuffle(colors)) as string; // Default to black if undefined

      try {
        mapRef.current?.addRoute(routeIdSelected, {
          currentMarkerOptions: {
            position: route?.startPosition,
            icon: makeCarIcon(color),
          },
          endMarkerOptions: {
            position: route?.endPosition,
            icon: makeMarkerIcon(color),
          },
        });
        socketIORef.current?.emit("new-direction", routeIdSelected);
      } catch (error) {
        if (error instanceof RouteExistsError) {
          enqueueSnackbar(`${route?.title} já adicionado, espere finalizar`, {
            variant: "error",
          });
          return;
        }
        throw error;
      }
    },
    [routeIdSelected, routes, enqueueSnackbar]
  );

  return (
    <Grid container style={{ width: "100%", height: "100%" }}>
      <Grid size={{ xs: 12, sm: 3 }}>
        <div>
          <Navbar />
          <form onSubmit={startRoute}>
            <Select
              fullWidth
              displayEmpty
              value={routeIdSelected}
              onChange={(event) => setRouteIdSelected(event.target.value + "")}
            >
              <MenuItem value="">
                <em>Selecione uma corrida</em>
              </MenuItem>
              {routes.map((route, key) => (
                <MenuItem key={key} value={route._id}>
                  <em>{route.title}</em>
                </MenuItem>
              ))}
            </Select>
            <classes.btnSubmitWrapper>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={{
                  borderRadius: "18px",
                }}
              >
                Iniciar uma corrida
              </Button>
            </classes.btnSubmitWrapper>
          </form>
        </div>
      </Grid>
      <Grid size={{ xs: 12, sm: 9 }}>
        <classes.map id="map"></classes.map>
      </Grid>
    </Grid>
  );
};

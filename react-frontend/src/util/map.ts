import { RouteExistsError } from "../error/route-exists.error";

export class Route {
  public currentMarker: google.maps.Marker;
  public endMarker: google.maps.Marker;
  private directionsRenderer: google.maps.DirectionsRenderer;

  constructor(options: {
    currentMarkerOptions: google.maps.ReadonlyMarkerOptions;
    endMarkerOptions: google.maps.ReadonlyMarkerOptions;
  }) {
    const { currentMarkerOptions, endMarkerOptions } = options;
    this.currentMarker = new google.maps.Marker(currentMarkerOptions);
    this.endMarker = new google.maps.Marker(endMarkerOptions);

    const strokeColor = (
      this.currentMarker.getIcon() as google.maps.ReadonlySymbol
    ).strokeColor;
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor,
        strokeOpacity: 0.5,
        strokeWeight: 5,
      },
    });
    this.directionsRenderer.setMap(
      this.currentMarker.getMap() as google.maps.Map
    );

    this.calculateRoute();
  }

  private calculateRoute(
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ) {
    const currentPosition = this.currentMarker.getPosition();
    const endPosition = this.endMarker.getPosition();

    if (!currentPosition || !endPosition) {
      console.error("Posições inválidas para calcular a rota.");
      return;
    }

    new google.maps.DirectionsService().route(
      {
        origin: currentPosition,
        destination: endPosition,
        travelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
        } else {
          console.error(`Erro ao calcular a rota: ${status}\n `);
        }
      }
    );
  }
}

export class Map {
  public map: google.maps.Map;
  private routes: { [id: string]: Route } = {};
  constructor(element: Element, options: google.maps.MapOptions) {
    this.map = new google.maps.Map(element, options);
  }

  addRoute(
    id: string,
    routeOptions: {
      currentMarkerOptions: google.maps.ReadonlyMarkerOptions;
      endMarkerOptions: google.maps.ReadonlyMarkerOptions;
    }
  ) {
    if (id in this.routes) {
      throw new RouteExistsError();
    }

    this.routes[id] = new Route({
      currentMarkerOptions: {
        ...routeOptions.currentMarkerOptions,
        map: this.map,
      },
      endMarkerOptions: {
        ...routeOptions.endMarkerOptions,
        map: this.map,
      },
    });
    this.fitBounds();
  }

  private fitBounds() {
    const bounds = new google.maps.LatLngBounds();

    Object.keys(this.routes).forEach((id: string) => {
      const route = this.routes[id];
      bounds.extend(route.currentMarker.getPosition() as any);
      bounds.extend(route.endMarker.getPosition() as any);
    });
    this.map.fitBounds(bounds);
  }
}

export const makeCarIcon = (color: string) => ({
  url: "/car.svg",
  fillColor: color,
  strokeColor: color,
  strokeWeight: 1,
  fillOpacity: 1,
  anchor: new google.maps.Point(26, 20),
  scaledSize: new google.maps.Size(30, 30),
});

export const makeMarkerIcon = (color: string) => ({
  url: "/marker-icon.svg",
  strokeColor: color,
  fillColor: color,
  strokeOpacity: 1,
  strokeWeight: 1,
  fillOpacity: 1,
  anchor: new google.maps.Point(15, 15),
  scaledSize: new google.maps.Size(30, 30),
});

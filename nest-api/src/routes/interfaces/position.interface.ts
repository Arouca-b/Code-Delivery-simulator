export interface Position {
  clientId: string;
  routeId: string;
  position: [number, number]; // [latitude, longitude]
  finished: boolean;
}

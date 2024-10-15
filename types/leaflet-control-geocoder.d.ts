// types/leaflet-control-geocoder.d.ts

import * as L from "leaflet";

declare module "leaflet" {
  namespace Control {
    class Geocoder extends Control {
      constructor(options?: GeocoderOptions);
    }

    namespace Geocoder {
      function nominatim(options?: any): GeocoderObject;
    }
  }
}

interface GeocoderOptions {
  defaultMarkGeocode?: boolean;
  geocoder?: L.Control.Geocoder.GeocoderObject;
}

interface GeocoderObject {
  geocode(query: string, cb: Function, context?: any): void;
  suggest?(query: string, cb: Function, context?: any): void;
  reverse(
    latLng: L.LatLngLiteral,
    scale: number,
    cb: Function,
    context?: any,
  ): void;
}

declare module "leaflet-control-geocoder" {}

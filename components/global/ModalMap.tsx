// components/ModalMap.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import { toast } from "react-hot-toast";

import { customIcon } from "@/types";

interface ModalMapProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
  isModalOpen: boolean;
}

const ModalMapComponent: React.FC<ModalMapProps> = ({
  onLocationChange,
  isModalOpen,
}) => {
  const [position, setPosition] = useState<L.LatLngLiteral | null>(null);

  const memoizedOnLocationChange = React.useCallback(
    (location: { lat: number; lng: number }) => {
      onLocationChange(location);
    },
    [onLocationChange],
  );

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const newPosition = { lat: latitude, lng: longitude };

            setPosition(newPosition);
            memoizedOnLocationChange(newPosition);
          },
          (_error) => {
            toast.error("Error getting your location");
            const fallbackPosition = { lat: 40.7128, lng: -74.006 };

            setPosition(fallbackPosition);
            memoizedOnLocationChange(fallbackPosition);
          },
        );
      } else {
        toast.error("Geolocation not available");
        const fallbackPosition = { lat: 40.7128, lng: -74.006 };

        setPosition(fallbackPosition);
        memoizedOnLocationChange(fallbackPosition);
      }
    }
  }, [memoizedOnLocationChange]);

  if (!position) {
    return <div>Loading map...</div>;
  }

  const GeocoderControl = React.memo(() => {
    const map = useMap();
    const geocoderRef = useRef<any>(null);

    useEffect(() => {
      if (!map || geocoderRef.current) return;

      // @ts-ignore
      const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
      })
        .on("markgeocode", function (e: any) {
          const latlng = e.geocode.center;

          setPosition(latlng);
          map.setView(latlng, map.getZoom());
          memoizedOnLocationChange(latlng);
        })
        .addTo(map);

      geocoderRef.current = geocoder;
    }, [map, memoizedOnLocationChange]);

    return null;
  });

  GeocoderControl.displayName = "GeocoderControl";

  const MapInvalidateSize = React.memo(() => {
    const map = useMap();

    useEffect(() => {
      if (map && isModalOpen) {
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    }, [map, isModalOpen]);

    return null;
  });

  MapInvalidateSize.displayName = "MapInvalidateSize";

  const MapEvents = React.memo(() => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        memoizedOnLocationChange(e.latlng);
      },
    });

    return null;
  });

  MapEvents.displayName = "MapEvents";

  return (
    <MapContainer
      center={position}
      style={{ height: "100%", width: "100%" }}
      zoom={13}
    >
      <MapInvalidateSize />
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={customIcon} position={position} />
      <GeocoderControl />
      <MapEvents />
    </MapContainer>
  );
};

const ModalMap = React.memo(ModalMapComponent);

ModalMap.displayName = "ModalMap";

export default ModalMap;

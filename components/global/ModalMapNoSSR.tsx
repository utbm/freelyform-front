// components/ModalMapNoSSR.tsx
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

import "leaflet-control-geocoder";
import { customIcon } from "@/types";

interface ModalMapNoSSRProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
  isModalOpen: boolean;
}

const ModalMapNoSSR: React.FC<ModalMapNoSSRProps> = ({
                                                       onLocationChange,
                                                       isModalOpen,
                                                     }) => {
  const [position, setPosition] = useState<L.LatLngLiteral | null>(null);

  // Function to get user's current location
  useEffect(() => {
    if (!position) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            setPosition({ lat: latitude, lng: longitude });
            onLocationChange({ lat: latitude, lng: longitude });
          },
          () => {
            // Fallback to default location
            setPosition({ lat: 37.7749, lng: -122.4194 });
          },
        );
      } else {
        // Fallback to default location
        setPosition({ lat: 37.7749, lng: -122.4194 });
      }
    }
  }, [position, onLocationChange]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onLocationChange(e.latlng);
      },
    });

    return null;
  };

  const GeocoderControl = () => {
    const map = useMap();

    useEffect(() => {
      // @ts-ignore
      const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        geocoder: L.Control.Geocoder.nominatim(),
      })
        .on("markgeocode", function (e: any) {
          const latlng = e.geocode.center;

          setPosition(latlng);
          map.setView(latlng, map.getZoom());
          onLocationChange(latlng);
        })
        .addTo(map);

      return () => {
        geocoder.remove();
      };
    }, [map, onLocationChange]);

    return null;
  };

  const MapInvalidateSize = () => {
    const map = useMap();

    useEffect(() => {
      if (map && isModalOpen) {
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }
    }, [map, isModalOpen]);

    return null;
  };

  // Don't render the map until the position is set
  if (!position) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={position}
      style={{ height: "100%", width: "100%" }}
      zoom={13}
    >
      <MapInvalidateSize />
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Marker at the selected position with custom icon */}
      <Marker icon={customIcon} position={position} />
      {/* Geocoder Control */}
      <GeocoderControl />
      {/* Handle map click events */}
      <MapEvents />
    </MapContainer>
  );
};

export default ModalMapNoSSR;

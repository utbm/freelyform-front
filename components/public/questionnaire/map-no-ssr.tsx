// components/MapNoSSR.tsx
"use client";

import React, { useState, useEffect } from "react";
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

interface MapNoSSRProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

const MapNoSSR: React.FC<MapNoSSRProps> = ({ onLocationChange }) => {
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
            // console.error("Error obtaining location:", error);
            // Fallback to default location (San Francisco)
            setPosition({ lat: 37.7749, lng: -122.4194 });
          },
        );
      } else {
        // console.error("Geolocation not available");
        // Fallback to default location (San Francisco)
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
    }, [map]);

    return null;
  };

  // Don't render the map until the position is set
  if (!position) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={position}
      style={{ height: "50vh", width: "100%" }}
      zoom={13}
    >
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

export default MapNoSSR;

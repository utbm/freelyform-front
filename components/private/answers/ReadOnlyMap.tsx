// components/ReadOnlyMap.tsx
"use client";

import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

import { customIcon } from "@/types";

interface ReadOnlyMapProps {
  initialPosition: { lat: number; lng: number };
}

const ReadOnlyMap: React.FC<ReadOnlyMapProps> = ({ initialPosition }) => {
  return (
    <MapContainer
      center={initialPosition}
      style={{ height: "50vh", width: "100%" }}
      zoom={13}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Marker at the selected position with custom icon */}
      <Marker icon={customIcon} position={initialPosition} />
    </MapContainer>
  );
};

export default ReadOnlyMap;

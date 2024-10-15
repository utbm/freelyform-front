// components/MapComponent.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

const MapNoSSR = dynamic(
  () => import("@/components/public/questionnaire/map-no-ssr"),
  { ssr: false },
);

interface MapComponentProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationChange }) => {
  return <MapNoSSR onLocationChange={onLocationChange} />;
};

export default MapComponent;

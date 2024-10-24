// components/ModalMapComponent.tsx
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Slider } from "@nextui-org/react";

const DynamicModalMap = dynamic(() => import("./ModalMap"), {
  ssr: false,
});

interface ModalMapComponentProps {
  onLocationChange: (location: { lat: number; lng: number }) => void;
  onDistanceChange: (distance: number) => void;
  isModalOpen: boolean;
}

const ModalMapComponentFunc: React.FC<ModalMapComponentProps> = ({
  onLocationChange,
  onDistanceChange,
  isModalOpen,
}) => {
  const [distance, setDistance] = React.useState<number>(10);

  const memoizedOnDistanceChange = React.useCallback(
    (distance: number) => {
      onDistanceChange(distance);
    },
    [onDistanceChange],
  );

  React.useEffect(() => {
    memoizedOnDistanceChange(distance);
  }, [distance, memoizedOnDistanceChange]);

  const handleLocationChange = React.useCallback(
    (location: { lat: number; lng: number }) => {
      onLocationChange(location);
    },
    [onLocationChange],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "60vh" }}>
      <div style={{ flex: "1 1 auto", position: "relative" }}>
        <DynamicModalMap
          isModalOpen={isModalOpen}
          onLocationChange={handleLocationChange}
        />
      </div>
      <SliderComponent distance={distance} setDistance={setDistance} />
    </div>
  );
};

const ModalMapComponent = React.memo(ModalMapComponentFunc);

ModalMapComponent.displayName = "ModalMapComponent";

const SliderComponentFunc = ({
  distance,
  setDistance,
}: {
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div style={{ padding: "1rem", backgroundColor: "#fff", zIndex: 1000 }}>
      <Slider
        aria-label="Distance"
        className="max-w-md"
        color="primary"
        label="Distance (km)"
        maxValue={200}
        minValue={5}
        size="sm"
        step={1}
        value={distance}
        // @ts-ignore
        onChange={setDistance}
      />
      <p className="text-default-500 font-medium text-small">
        Selected distance: {distance} km
      </p>
    </div>
  );
};

const SliderComponent = React.memo(SliderComponentFunc);

SliderComponent.displayName = "SliderComponent";

export default ModalMapComponent;

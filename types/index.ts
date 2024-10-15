import { SVGProps } from "react";
import L from "leaflet";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export const customIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=utf8," +
    encodeURIComponent(`
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path d="M512 85.333333c-164.949333 0-298.666667 133.738667-298.666667 298.666667 0 164.949333 298.666667 554.666667 298.666667 554.666667s298.666667-389.717333 298.666667-554.666667c0-164.928-133.717333-298.666667-298.666667-298.666667z m0 448a149.333333 149.333333 0 1 1 0-298.666666 149.333333 149.333333 0 0 1 0 298.666666z" fill="#FF3D00" />
    </svg>
  `),
  iconSize: [40, 40], // Adjust the size as needed
  iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
});

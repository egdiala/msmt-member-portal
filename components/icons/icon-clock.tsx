import { HTMLAttributes } from "react";

export const IconClock = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.9998 6.73102V12.731L15.9998 14.731M21.9998 12.731C21.9998 18.2539 17.5226 22.731 11.9998 22.731C6.47691 22.731 1.99976 18.2539 1.99976 12.731C1.99976 7.20817 6.47691 2.73102 11.9998 2.73102C17.5226 2.73102 21.9998 7.20817 21.9998 12.731Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

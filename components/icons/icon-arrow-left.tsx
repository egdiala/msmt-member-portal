import { HTMLAttributes } from "react";

export const IconArrowLeft = (props: HTMLAttributes<SVGElement>) => {
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
        d="M5.99976 8.73102L1.99976 12.731M1.99976 12.731L5.99976 16.731M1.99976 12.731H21.9998"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

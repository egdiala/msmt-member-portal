import { HTMLAttributes } from "react";

export const IconTick = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="0.515625"
        y="0.248047"
        width="16"
        height="16"
        rx="8"
        fill="#0AA571"
      />
      <path
        d="M4.91406 8.24775L7.04463 10.3783L11.3133 6.11719"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

import { HTMLAttributes } from "react";

export const IconNavlinkCheckmark = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        y="0.731018"
        width="32"
        height="32"
        rx="16"
        fill="url(#paint0_linear_8133_3993)"
      />
      <path
        d="M10.0015 16.7313L13.9963 20.726L22 12.7365"
        stroke="#F3F5F5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_8133_3993"
          x1="15.3538"
          y1="0.731018"
          x2="15.3538"
          y2="32.731"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0A363C" />
          <stop offset="0.994393" stopColor="#006117" />
        </linearGradient>
      </defs>
    </svg>
  );
};

import { HTMLAttributes } from "react";

export const IconChart = (props: HTMLAttributes<SVGElement>) => {
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
        d="M11.9998 16.731V21.731M15.9998 14.731V21.731M19.9998 10.731V21.731M21.9998 3.73102L13.3538 12.377C13.3073 12.4236 13.2521 12.4605 13.1914 12.4857C13.1306 12.5109 13.0655 12.5239 12.9998 12.5239C12.934 12.5239 12.8689 12.5109 12.8081 12.4857C12.7474 12.4605 12.6922 12.4236 12.6458 12.377L9.35376 9.08502C9.25999 8.99128 9.13284 8.93862 9.00026 8.93862C8.86767 8.93862 8.74052 8.99128 8.64676 9.08502L1.99976 15.731M3.99976 18.731V21.731M7.99976 14.731V21.731"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

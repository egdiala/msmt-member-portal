import { HTMLAttributes } from "react";

export const IconLoading = (props: HTMLAttributes<SVGElement>) => {
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
        d="M11.9998 5.23102C16.1414 5.23102 19.4998 8.58935 19.4998 12.731"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9998 5.23102C16.1414 5.23102 19.4998 8.58935 19.4998 12.731C19.4998 16.8727 16.1414 20.231 11.9998 20.231C7.85809 20.231 4.49976 16.8727 4.49976 12.731C4.49976 8.58935 7.85809 5.23102 11.9998 5.23102Z"
        stroke="black"
        strokeOpacity="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

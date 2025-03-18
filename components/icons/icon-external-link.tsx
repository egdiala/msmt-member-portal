import { HTMLAttributes } from "react";

export const IconExternalLink = (props: HTMLAttributes<SVGElement>) => {
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
        d="M7 7.73102H17M17 7.73102V17.731M17 7.73102L7 17.731"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

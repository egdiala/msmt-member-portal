import { HTMLAttributes } from "react";

export const IconHourglass = (props: HTMLAttributes<SVGElement>) => {
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
        d="M4.99976 22.731H18.9998M4.99976 2.73102H18.9998M16.9998 22.731V18.559C16.9996 18.0286 16.7889 17.52 16.4138 17.145L11.9998 12.731M11.9998 12.731L7.58576 17.145C7.21066 17.52 6.99987 18.0286 6.99976 18.559V22.731M11.9998 12.731L7.58576 8.31702C7.21066 7.94203 6.99987 7.43341 6.99976 6.90302V2.73102M11.9998 12.731L16.4138 8.31702C16.7889 7.94203 16.9996 7.43341 16.9998 6.90302V2.73102"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

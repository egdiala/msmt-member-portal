import { HTMLAttributes } from "react";

export const IconSearch = (props: HTMLAttributes<SVGElement>) => {
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
        d="M21 21.731L16.7 17.431M19 11.731C19 16.1493 15.4183 19.731 11 19.731C6.58172 19.731 3 16.1493 3 11.731C3 7.31274 6.58172 3.73102 11 3.73102C15.4183 3.73102 19 7.31274 19 11.731Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

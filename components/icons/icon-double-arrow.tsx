import { HTMLAttributes } from "react";

export const IconDoubleArrow = (props: HTMLAttributes<SVGElement>) => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.1816 17.6128L18.1816 12.6128L13.1816 7.61279M6.18164 17.6128L11.1816 12.6128L6.18164 7.61279"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

import { HTMLAttributes } from "react";

export const IconList = (props: HTMLAttributes<SVGElement>) => {
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
        d="M2.99976 17.731L4.99976 19.731L8.99976 15.731M12.9998 6.73102H20.9998M12.9998 12.731H20.9998M12.9998 18.731H20.9998M3.99976 5.73102H7.99976C8.55204 5.73102 8.99976 6.17873 8.99976 6.73102V10.731C8.99976 11.2833 8.55204 11.731 7.99976 11.731H3.99976C3.44747 11.731 2.99976 11.2833 2.99976 10.731V6.73102C2.99976 6.17873 3.44747 5.73102 3.99976 5.73102Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

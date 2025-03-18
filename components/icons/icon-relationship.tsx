import { HTMLAttributes } from "react";

export const IconRelationship = (props: HTMLAttributes<SVGElement>) => {
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
        d="M7 11.731V15.731C7 16.2615 7.21071 16.7702 7.58579 17.1452C7.96086 17.5203 8.46957 17.731 9 17.731H13M5 3.73102H9C10.1046 3.73102 11 4.62645 11 5.73102V9.73102C11 10.8356 10.1046 11.731 9 11.731H5C3.89543 11.731 3 10.8356 3 9.73102V5.73102C3 4.62645 3.89543 3.73102 5 3.73102ZM15 13.731H19C20.1046 13.731 21 14.6264 21 15.731V19.731C21 20.8356 20.1046 21.731 19 21.731H15C13.8954 21.731 13 20.8356 13 19.731V15.731C13 14.6264 13.8954 13.731 15 13.731Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

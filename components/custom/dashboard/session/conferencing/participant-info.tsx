import React, { ReactNode } from "react";

interface ParticipantInfoProps {
  name: string;
  role: string;
  children?: ReactNode;
  className?: string;
}

const ParticipantInfo = ({ name, role, children, className = "" }: ParticipantInfoProps) => {
  return (
    <div className={`participant-info ${className}`}>
      <div className="font-medium">{name}</div>
      <div className="text-xs opacity-80">{role}</div>
      {children}
    </div>
  );
};

export default ParticipantInfo;
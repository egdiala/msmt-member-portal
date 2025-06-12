"use client";

import React, { Suspense } from "react";
import { StartSession } from "@/components/custom/dashboard/session/start-session";

const SessionPage = () => {
  return (
    <Suspense fallback={<div className="text-xl text-brand-1">Retrieving Meeting&apos;s Information</div>}>
      <StartSession />
    </Suspense>
  );
};

export default SessionPage;

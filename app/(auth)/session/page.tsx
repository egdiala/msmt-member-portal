"use client";

import React, { Suspense } from "react";
import { StartSession } from "@/components/custom/dashboard/session/start-session";

const SessionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StartSession />
    </Suspense>
  );
};

export default SessionPage;

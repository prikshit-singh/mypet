'use client';

import React, { Suspense } from "react";
import VerifyAccount from "@/components/VerifyAccount";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAccount />
    </Suspense>
  );
}
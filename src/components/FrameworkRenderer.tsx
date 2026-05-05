"use client";

import { type FrameworkResult, VIEWS } from "@/frameworks";
import type { ComponentType } from "react";

export function FrameworkRenderer({ result }: { result: FrameworkResult }) {
  const View = VIEWS[result.framework] as ComponentType<{ data: FrameworkResult }>;
  return (
    <div className="space-y-6">
      <View data={result} />
    </div>
  );
}

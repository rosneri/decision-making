import { Suspense } from "react";
import { DecisionApp } from "@/components/DecisionApp";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <DecisionApp />
    </Suspense>
  );
}

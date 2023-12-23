import { Suspense } from "react";
import { Results, ResultsSkeleton } from "./_components/results";

export default function Home() {
  return (
    <div className="h-full p-8 max-w-screen-xl mx-auto">
      <Suspense fallback={<ResultsSkeleton />}>
        <Results />
      </Suspense>
    </div>
  );
}

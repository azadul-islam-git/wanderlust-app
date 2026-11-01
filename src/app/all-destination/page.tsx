import { Suspense } from "react";
import { connection } from "next/server";
import { Playfair_Display } from "next/font/google";

import AllDestinations, {
  type Destination,
} from "@/components/AllDestinations";

const playfair = Playfair_Display({ subsets: ["latin"] });

async function getDestinations(): Promise<Destination[]> {
  // Render per-request so the listing always reflects the live backend.
  await connection();
  const res = await fetch("http://localhost:8000/destination");
  if (!res.ok) {
    throw new Error(`Failed to load destinations (${res.status})`);
  }
  return res.json();
}

async function DestinationGrid() {
  let destinations: Destination[];
  try {
    destinations = await getDestinations();
  } catch {
    return (
      <p className="mt-16 text-center text-neutral-500">
        Couldn&apos;t load destinations. Make sure the backend is running on
        localhost:8000.
      </p>
    );
  }
  return <AllDestinations destinations={destinations} />;
}

function GridSkeleton() {
  return (
    <>
      <div className="mt-6 h-12 animate-pulse rounded-lg bg-neutral-100" />
      <p className="mt-4 text-sm text-neutral-400">Loading destinations…</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white p-1.5"
          >
            <div className="aspect-video w-full animate-pulse rounded-md bg-neutral-100" />
            <div className="space-y-2 px-1.5 pt-3 pb-2">
              <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-3 w-16 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function AllDestinationPage() {
  return (
    <main className="min-h-screen bg-white px-4 pt-8 pb-16">
      <div className="mx-auto max-w-7xl px-2">
        <h1 className={`${playfair.className} text-4xl text-neutral-900`}>
          Explore All Destinations
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Find your perfect travel experience from our curated collection
        </p>

        <Suspense fallback={<GridSkeleton />}>
          <DestinationGrid />
        </Suspense>
      </div>
    </main>
  );
}

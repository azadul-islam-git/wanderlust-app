import { connection } from "next/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { ArrowLeft, CalendarDays, Check, Star } from "lucide-react";

import BookingCard from "@/components/BookingCard";
import type { Destination } from "@/components/AllDestinations";
import { EditDestination } from "@/components/EditDestination";
import DeleteDestination from "@/components/DeleteDestination";

const playfair = Playfair_Display({ subsets: ["latin"] });

const highlightsByCategory: Record<string, string[]> = {
  beach: [
    "Beachfront accommodation",
    "Guided snorkeling trip",
    "Sunset catamaran cruise",
    "Seafood dinner by the shore",
    "Sunrise beach yoga session",
  ],
  mountain: [
    "Guided summit trek",
    "Mountain lodge stay",
    "Cable car ride",
    "Alpine lake day trip",
    "Stargazing night experience",
  ],
  city: [
    "Old town walking tour",
    "Local street food tasting",
    "Skyline rooftop evening",
    "Museum pass included",
    "Night market visit",
  ],
  cultural: [
    "Heritage temple visits",
    "Traditional cooking class",
    "Local artisan workshop",
    "Folk dance performance",
    "Historic quarter tour",
  ],
  adventure: [
    "White-water rafting",
    "Zip-line canopy course",
    "Cliff-side hiking trail",
    "Caving expedition",
    "ATV jungle trail ride",
  ],
};

const defaultHighlights = [
  "Expert local guide",
  "Handpicked accommodation",
  "Flexible itinerary",
  "Airport transfers",
  "24/7 trip support",
];

async function getDestination(id: string): Promise<Destination | null> {
  // Render per-request so the page always reflects the live backend.
  await connection();
  const res = await fetch(`http://localhost:8000/destination/${id}`);
  // The API returns 500 for malformed ids and an empty body for missing ones.
  if (!res.ok) return null;
  const data: unknown = await res.json().catch(() => null);
  return (data as Destination | null) ?? null;
}

export default async function DestinationDetailsPage({
  params,
}: PageProps<"/all-destination/[id]">) {
  const { id } = await params;

  // Fetched here rather than in a <Suspense> child so notFound() can still
  // set the HTTP status: thrown inside a Suspense boundary it renders the 404
  // UI but the response has already streamed out as 200.
  const destination = await getDestination(id);
  if (!destination) notFound();

  const name = destination.name.trim();
  const country = destination.country.trim();
  const days = Number(destination.duration);
  const durationLabel = Number.isFinite(days)
    ? `${days} Days / ${Math.max(days - 1, 0)} Nights`
    : destination.duration.trim();
  const highlights =
    highlightsByCategory[destination.category.trim().toLowerCase()] ??
    defaultHighlights;

  return (
    <main className="min-h-screen bg-white px-4 pt-6 pb-16">
      <div className="mx-auto max-w-7xl px-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/all-destination"
            className="flex items-center gap-2 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to Destinations
          </Link>

          {/* TODO: the backend has no PUT/DELETE routes yet — wire these up
              when edit/delete endpoints exist. */}
          <div className="flex gap-2">
            <EditDestination id={id} destination={destination} />
            <DeleteDestination id={id} />
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-xl">
          <Image
            src={destination.imageUrl}
            alt={name}
            width={1440}
            height={560}
            priority
            sizes="100vw"
            className="aspect-16/7 w-full object-cover"
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="flex items-center gap-1.5 text-sm text-neutral-500">
              <CalendarDays className="size-4" aria-hidden />
              {country}
            </p>

            <h1
              className={`${playfair.className} mt-2 text-4xl text-neutral-900 md:text-5xl`}
            >
              {name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-emerald-600 text-emerald-600" />
                <span className="font-semibold">4.9</span>
                <span className="text-neutral-500">(234 reviews)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden />
                {durationLabel}
              </span>
            </div>

            <h2
              className={`${playfair.className} mt-8 text-2xl text-neutral-900`}
            >
              Overview
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {destination.description}
            </p>

            <h2
              className={`${playfair.className} mt-8 text-2xl text-neutral-900`}
            >
              Highlights
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {destination.description}
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-center gap-2 text-sm text-neutral-600"
                >
                  <Check
                    className="size-4 shrink-0 text-emerald-600"
                    aria-hidden
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="self-start lg:sticky lg:top-6">
            <BookingCard
              price={destination.price}
              departureDate={destination.departureDate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

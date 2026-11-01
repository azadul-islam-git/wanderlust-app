"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const perks = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
];

/**
 * Booking card shown on the destination details page.
 *
 * The Book Now action is a stub: the backend (`wanderlust-app-server`) has no
 * booking endpoint yet. Replace the timeout with a real API call when one
 * exists.
 */
export default function BookingCard({
  price,
  departureDate,
}: {
  price: string;
  departureDate: string;
}) {
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  function handleBook() {
    setIsBooking(true);
    window.setTimeout(() => {
      setIsBooking(false);
      setBooked(true);
    }, 800);
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <p className="text-sm text-neutral-500">Starting from</p>
      <p className="mt-1 text-3xl font-bold text-cyan-600">${price}</p>
      <p className="mt-0.5 text-xs text-neutral-500">per person</p>

      <div className="my-5 border-t border-neutral-200" />

      <Input
        type="date"
        defaultValue={departureDate}
        aria-label="Departure date"
        className="h-9 rounded-md border border-transparent bg-slate-50 px-3 focus-visible:bg-white"
      />

      <Button
        type="button"
        onClick={handleBook}
        disabled={isBooking}
        className="mt-4 w-full bg-cyan-500 py-6 text-white hover:bg-cyan-600"
      >
        {isBooking ? "Booking…" : "Book Now"}
        <ArrowRight aria-hidden />
      </Button>

      {booked ? (
        <p
          role="status"
          className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
        >
          Booking request sent!
        </p>
      ) : null}

      <ul className="mt-5 space-y-2.5">
        {perks.map((perk) => (
          <li
            key={perk}
            className={cn("flex items-center gap-2 text-sm text-neutral-600")}
          >
            <Check className="size-4 shrink-0 text-emerald-500" aria-hidden />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}

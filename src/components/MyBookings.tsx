"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Ticket,
  Trash2,
} from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });

export type Booking = {
  _id: string;
  /** Destination id. Optional: today BookingCard spreads `...destination` so
   *  `_id` IS the destination id, but if the backend ever starts generating
   *  its own booking ids it should send `destinationId` instead. */
  destinationId?: string;
  name: string;
  price: string;
  imageUrl: string;
  departureDate: string;
  bookingDate?: string;
  status?: string;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  // timeZone: UTC keeps date-only ISO strings ("2026-10-31") from shifting a
  // day backwards in negative-offset timezones.
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function StatusBadge({ status }: { status: string }) {
  const isConfirmed = status.toLowerCase() === "confirmed";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        isConfirmed
          ? "bg-emerald-50 text-emerald-600"
          : "bg-amber-50 text-amber-600"
      }`}
    >
      {isConfirmed ? (
        <CheckCircle2 className="size-3.5" aria-hidden />
      ) : (
        <Clock className="size-3.5" aria-hidden />
      )}
      {isConfirmed ? "Confirmed" : "Pending"}
    </span>
  );
}

export default function MyBookings({ bookings }: { bookings: Booking[] }) {
  const [items, setItems] = useState(bookings);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel(booking: Booking) {
    const label = booking.name.trim();
    if (
      !window.confirm(
        `Cancel your booking for ${label}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setCancellingId(booking._id);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8000/myBookings/${booking._id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(`DELETE failed (${res.status})`);
      setItems((prev) => prev.filter((item) => item._id !== booking._id));
    } catch {
      setError(
        "Couldn't cancel this booking — the backend needs a DELETE /booking/:id route.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-16 rounded-lg border border-dashed border-neutral-300 p-10 text-center">
        <p className="text-neutral-600">
          You don&apos;t have any bookings yet.
        </p>
        <Link
          href="/all-destination"
          className="mt-4 inline-block rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
        >
          Explore Destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      {error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}

      {items.map((booking) => (
        <div
          key={booking._id}
          className="rounded-lg border border-neutral-200 bg-white p-4"
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <Image
              src={booking.imageUrl}
              alt={booking.name.trim()}
              width={640}
              height={480}
              className="aspect-4/3 w-full shrink-0 rounded-lg object-cover sm:w-64"
            />

            <div className="flex min-w-0 flex-1 flex-col">
              <div>
                <StatusBadge status={booking.status ?? "confirmed"} />
              </div>

              <h2
                className={`${playfair.className} mt-2 text-2xl text-neutral-900 md:text-3xl`}
              >
                {booking.name.trim()}
              </h2>

              <div className="mt-3 space-y-1.5 text-sm text-neutral-600">
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 shrink-0" aria-hidden />
                  Departure: {formatDate(booking.departureDate)}
                </p>
                <p className="flex items-center gap-1.5">
                  <Ticket className="size-4 shrink-0" aria-hidden />
                  Booking ID: {booking._id}
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold text-cyan-600">
                ${booking.price}
              </p>
            </div>

            <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:items-end sm:justify-end">
              <button
                type="button"
                onClick={() => handleCancel(booking)}
                disabled={cancellingId === booking._id}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 bg-white px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="size-4" aria-hidden />
                {cancellingId === booking._id ? "Cancelling…" : "Cancel"}
              </button>
              <Link
                href={`/all-destination/${booking.destinationId ?? booking._id}`}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-cyan-500 px-4 text-sm font-medium text-white transition-colors hover:bg-cyan-600"
              >
                <Eye className="size-4" aria-hidden />
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

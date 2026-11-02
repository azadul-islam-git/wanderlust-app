import { headers } from "next/headers";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { CalendarX } from "lucide-react";

import { auth } from "@/lib/auth";
import MyBookings, { type Booking } from "@/components/MyBookings";

const playfair = Playfair_Display({ subsets: ["latin"] });

async function getBookings(email: string): Promise<Booking[] | null> {
  // headers() is already a request-time API so the route renders per-request;
  // connection() would be redundant here.
  const res = await fetch(
    `http://localhost:8000/my-bookings/${encodeURIComponent(email)}`,
  );
  if (!res.ok) return null;
  return res.json();
}

async function BookingsList({ email }: { email: string }) {
  let bookings: Booking[] | null;
  try {
    bookings = await getBookings(email);
  } catch {
    bookings = null;
  }

  if (bookings === null) {
    return (
      <div className="mt-16 rounded-lg border border-dashed border-neutral-300 p-10 text-center">
        <CalendarX className="mx-auto size-6 text-neutral-400" aria-hidden />
        <p className="mt-3 text-neutral-600">
          Couldn&apos;t load your bookings. Make sure the backend is running on
          localhost:8000.
        </p>
      </div>
    );
  }

  return <MyBookings bookings={bookings} />;
}

export default async function MyBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  return (
    <main className="min-h-screen bg-white px-4 pt-8 pb-16">
      <div className="mx-auto max-w-7xl px-2">
        <h1 className={`${playfair.className} text-4xl text-neutral-900`}>
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Manage and view your upcoming travel plans
        </p>

        {user ? (
          <BookingsList email={user.email} />
        ) : (
          <div className="mt-16 rounded-lg border border-dashed border-neutral-300 p-10 text-center">
            <p className="text-neutral-600">
              Please log in to see your bookings.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cyan-700"
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin, Star } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export type Destination = {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "u250", label: "Under $250", test: (p: number) => p < 250 },
  {
    value: "250-500",
    label: "$250 – $500",
    test: (p: number) => p >= 250 && p < 500,
  },
  {
    value: "500-1000",
    label: "$500 – $1,000",
    test: (p: number) => p >= 500 && p < 1000,
  },
  { value: "o1000", label: "$1,000+", test: (p: number) => p >= 1000 },
] as const;

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name (A – Z)" },
] as const;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function DestinationCard({ destination }: { destination: Destination }) {
  const name = destination.name.trim();
  const country = destination.country.trim();

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white p-1.5 transition-shadow hover:shadow-md">
      <div className="relative overflow-hidden rounded-md">
        <Image
          src={destination.imageUrl}
          alt={name}
          width={800}
          height={450}
          className="aspect-video w-full object-cover"
        />
        <span className="absolute top-2 right-2 flex items-center gap-1 rounded bg-white px-2 py-0.5 text-xs font-semibold text-neutral-900 shadow-sm">
          4.5
          <Star className="size-3 fill-neutral-900 text-neutral-900" />
        </span>
      </div>

      <div className="space-y-2 px-1.5 pt-3 pb-2">
        <p className="flex items-center gap-1.5 text-xs text-neutral-500">
          <MapPin className="size-3" />
          {country}
        </p>

        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 truncate text-xl font-semibold text-neutral-900">
            {name}
          </h3>
          <p className="shrink-0">
            <span className="text-lg font-bold text-neutral-900">
              ${destination.price}
            </span>
            <span className="text-xs text-neutral-400">/Person</span>
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-neutral-500">
          <CalendarDays className="size-3" />
          {destination.duration} Days
        </p>

        <Link
          href={`/all-destination/${destination._id}`}
          className="inline-flex items-center gap-1 text-xs font-bold tracking-wide text-cyan-600 uppercase hover:text-cyan-700"
        >
          Book Now
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function AllDestinations({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [sort, setSort] = useState<string | null>(null);

  const categoryOptions = Array.from(
    new Set(destinations.map((d) => d.category.trim().toLowerCase())),
  );

  let visible = destinations.filter((d) => {
    if (category && category !== "all") {
      if (d.category.trim().toLowerCase() !== category) return false;
    }
    if (priceRange && priceRange !== "all") {
      const range = priceRanges.find((r) => r.value === priceRange);
      if (range && "test" in range && !range.test(Number(d.price)))
        return false;
    }
    return true;
  });

  if (sort === "price-asc") {
    visible = [...visible].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "price-desc") {
    visible = [...visible].sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sort === "name") {
    visible = [...visible].sort((a, b) => a.name.localeCompare(b.name));
  }

  const triggerClass =
    "h-12 w-full justify-between rounded-none border-0 bg-transparent px-4 shadow-none hover:bg-neutral-50 focus-visible:ring-0 data-[size=default]:h-12 data-placeholder:text-neutral-500 data-placeholder:tracking-wide data-placeholder:uppercase";

  return (
    <>
      <div className="mt-6 grid divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label="Category" className={triggerClass}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {capitalize(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger aria-label="Price range" className={triggerClass}>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger aria-label="Sort by" className={triggerClass}>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sorts.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        Showing {visible.length} destination{visible.length === 1 ? "" : "s"}
      </p>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          No destinations match your filters.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((destination) => (
            <DestinationCard key={destination._id} destination={destination} />
          ))}
        </div>
      )}
    </>
  );
}

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

const searchFields = [
  { label: "Location", value: "Address, City Or Zip", className: "" },
  { label: "Date/Duration", value: "Anytime/3 Days", className: "" },
  { label: "Budget", value: "$0-$3000", className: "" },
  { label: "People", value: "5-10", className: "md:flex-[0.6]" },
];

export default function Banner() {
  return (
    <section className="relative flex min-h-135 flex-col overflow-hidden lg:min-h-150">
      {/* Background image + dark overlay */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/images/Banner.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <h1
          className={`${playfair.className} text-4xl leading-[1.15] text-white sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mt-5 max-w-xl text-base text-gray-100 md:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md bg-cyan-500 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-cyan-600"
          >
            Explore Now
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="#"
            className="rounded-md bg-white/20 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/30"
          >
            View Destination
          </a>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative z-10 flex flex-col bg-black/60 md:flex-row">
        {searchFields.map((field, index) => (
          <div
            key={field.label}
            className={`flex-1 px-6 py-3.5 text-left ${field.className} ${
              index > 0
                ? "border-t border-white/20 md:border-t-0 md:border-l"
                : ""
            }`}
          >
            <p className="text-sm font-medium text-white">{field.label}</p>
            <p className="mt-0.5 text-xs text-gray-300">{field.value}</p>
          </div>
        ))}
        <button
          type="button"
          className="bg-cyan-500 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-cyan-600"
        >
          Search
        </button>
      </div>
    </section>
  );
}

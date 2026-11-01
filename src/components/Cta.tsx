import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function Cta() {
  return (
    <section className="relative flex min-h-[440px] items-center justify-center overflow-hidden px-6 py-16">
      <Image
        src="/images/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 text-center">
        <h2 className={`${playfair.className} text-4xl text-white md:text-5xl`}>
          Ready To Start Your Journey?
        </h2>
        <p className="mt-5 text-base text-white/90">
          Join thousands of travelers who have discovered the world with us
        </p>
        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          Book Your Trip Today
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </section>
  );
}

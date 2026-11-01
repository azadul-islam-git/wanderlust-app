import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#e4f4f9] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2
            className={`${playfair.className} text-4xl text-neutral-900 sm:text-5xl lg:text-6xl`}
          >
            Why Choose Wanderlust
          </h2>
          <p className="mt-3 text-sm text-neutral-500 md:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-neutral-100 bg-white p-6 shadow-sm md:p-8"
            >
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <h3
                className={`${playfair.className} mt-6 text-xl text-neutral-900 md:text-2xl`}
              >
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-neutral-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const playfair = Playfair_Display({ subsets: ["latin"] });

const testimonials = [
  {
    quote:
      '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/person2.png",
  },
  {
    quote:
      '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person1.png",
  },
  {
    quote:
      '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
    name: "Michael C",
    location: "Singapore",
    image: "/images/person2.png",
  },
  {
    quote:
      '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
    name: "Sarah J",
    location: "New York, USA",
    image: "/images/person1.png",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Carousel opts={{ align: "start", loop: true }}>
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2
                className={`${playfair.className} text-4xl text-neutral-900 sm:text-5xl lg:text-6xl`}
              >
                What Travelers Say
              </h2>
              <p className="mt-3 text-sm text-neutral-500 md:text-base">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex shrink-0 gap-4">
              <CarouselPrevious className="static h-12 w-12 [&_svg]:size-5" />
              <CarouselNext className="static h-12 w-12 [&_svg]:size-5" />
            </div>
          </div>

          <CarouselContent className="mt-8">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name} className="md:basis-1/2">
                <div className="flex h-full overflow-hidden rounded-lg border border-neutral-200 bg-white p-2">
                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <blockquote
                      className={`${playfair.className} text-lg leading-relaxed text-neutral-900`}
                    >
                      {testimonial.quote}
                    </blockquote>
                    <div className="mt-auto pt-6">
                      <p className="text-sm font-medium text-cyan-600">
                        — {testimonial.name}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={218}
                    height={264}
                    className="w-[32%] shrink-0 object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

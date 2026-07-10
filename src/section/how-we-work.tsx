"use client";

import { HowWeWorkCard } from "@/components/cards";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

const howWeWorkConfig = [
  {
    step: 1,
    title: "Add Your Expenses",
    description:
      "Easily log daily cash transactions — food, travel, bills, and more.",
    imgUrl: "/images/home/4.svg",
  },
  {
    step: 2,
    title: "Categorize & Organize",
    description:
      "Automatically group your expenses to see where your money goes.",
    imgUrl: "/images/home/25.svg",
  },
  {
    step: 3,
    title: "Track & Improve",
    description:
      "Get smart insights and monthly reports to manage your spending better.",
    imgUrl: "/images/home/26.svg",
  },
];

export default function HowWeWork() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold text-center mb-12"
        >
          How it Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          Simplify your financial journey with our easy-to-follow process. Track
          spending, set goals, and get personalized insights—all in one place.
        </motion.p>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {howWeWorkConfig.map((item, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                  >
                    <HowWeWorkCard {...item} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots className="sm:hidden flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

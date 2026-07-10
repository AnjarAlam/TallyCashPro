"use client";

import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { loginServices } from "@/constants/mock";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
type Props = {};

function LoginCarousel({}: Props) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-sm"
      opts={{ loop: true }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {loginServices.map((service, index) => (
          <CarouselItem
            key={index}
            className="flex flex-col items-center justify-center text-center space-y-6"
          >
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              width={500}
              height={500}
              className="mx-auto"
            />
            <h2 className="text-2xl font-medium">{service.title}</h2>
            <p className="text-sm text-white/80 dark:text-gray-300">
              {service.description}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  );
}

export default LoginCarousel;

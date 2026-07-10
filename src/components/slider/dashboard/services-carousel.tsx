"use client";

import { ServicesCard } from "@/components/cards";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import { dashboardConfig } from "@/constants/mock";

export default function ServiceCarousel() {
  return (
    <div className="w-full overflow-hidden">
      <Carousel className="w-full p-0">
        <CarouselContent
          className="-ml-3 p-0 px-0"
          carouselRefClassName="overflow-visible
        "
        >
          {dashboardConfig.services.map((card, index) => (
            <CarouselItem
              key={index}
              className="flex justify-center pl-3 basis-full items-stretch "
            >
              <ServicesCard
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                onClose={() => console.log(`Card ${index + 1} closed`)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
        <CarouselDots />
      </Carousel>
    </div>
  );
}

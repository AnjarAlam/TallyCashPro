import { IconButton } from "@/components/buttons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

interface HeroProps {
  image: StaticImageData | string;
  title: string;
  description: string;
  ctaButtonText?: string;
  promoText?: string;
  order?: boolean; // true for image on left, false (or undefined) for image on right
}

export function BenifitsSectionCard({
  image,
  title,
  description,
  ctaButtonText = "Get Started",
  promoText = "Signup now and get $5 instantly! >",
  order = false, // default to image on right
}: HeroProps) {
  return (
    <section className=" py-4 sm:py-4 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-4xl">
        {/* Conditional rendering based on order prop */}
        {order && (
          <div className="rounded-3xl bg-gray-500/5 p-6">
            <AspectRatio ratio={4 / 3} className="rounded-lg overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className="h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
              />
            </AspectRatio>
          </div>
        )}

        <div className="flex flex-col gap-y-4">
          {promoText && (
            <Button className="w-min bg-transparent text-black border border-black shadow-none hover:bg-accent hover:shadow inline-block px-3 py-1 rounded-full mb-4">
              {promoText}
            </Button>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            {title}
          </h1>
          <p className="text-lg mb-8">{description}</p>
          <IconButton
            text={ctaButtonText}
            icon={ArrowUpRight}
            className="max-w-52 rounded-full justify-between bg-transparent border-blue-800 font-medium pl-4"
            iconClass="text-blue-800"
            iconContainerClass="rounded-full"
          />
        </div>

        {!order && (
          <div className="rounded-3xl bg-gray-500/5 p-6">
            <AspectRatio ratio={4 / 3} className="rounded-lg overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                fill
                className="h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
              />
            </AspectRatio>
          </div>
        )}
      </div>
    </section>
  );
}

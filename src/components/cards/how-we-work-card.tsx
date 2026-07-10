import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface HowWeWorkCardProps {
  imgUrl: string | StaticImageData;
  imgAlt?: string;
  title: string;
  description: string;
}

export default function HowWeWorkCard({
  imgUrl,
  imgAlt = "How we work",
  title,
  description,
}: HowWeWorkCardProps) {
  return (
    <section className="w-full">
      <Card className="py-0 overflow-hidden border-none shadow-none">
        <CardHeader className="text-center">
          <AspectRatio
            ratio={4 / 3} // Changed from 1 / 1 to 16 / 9 to better fit wider images
            className={cn(
              "mx-auto flex items-center justify-center overflow-hidden"
            )}
          >
            <Image src={imgUrl} alt={imgAlt} fill className="object-contain" />
          </AspectRatio>
          <CardTitle className="text-xl font-bold text-gray-900 mt-3">
            <h1 className="text-lg md:text-2xl font-bold text-black">
              {title}
            </h1>
          </CardTitle>
          <CardContent className="text-gray-600">{description}</CardContent>
        </CardHeader>
      </Card>
    </section>
  );
}

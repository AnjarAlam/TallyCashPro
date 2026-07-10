"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  staggerContainer,
  cardVariants,
  fadeIn,
  imageVariants,
  itemVariants,
  textVariants,
  zoomIn,
} from "@/lib/framer-varients";

interface FeatureCardProps {
  imgUrl: string | StaticImageData;
  imgAlt?: string;
  title: string;
  description: string;
  isLong?: boolean;
}

export default function FeatureCard({
  imgUrl,
  imgAlt = "Features",
  title,
  description,
  isLong = false,
}: FeatureCardProps) {
  return (
    <motion.div
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <Card className="border-none bg-gray-500/5 shadow-none rounded-4xl p-6 md:p-10 overflow-hidden">
        <motion.div variants={fadeIn("up", "spring", 0.5, 1)}>
          <CardHeader
            className={cn("relative sm:text-start text-center p-0", {
              "flex flex-col md:flex-row items-center gap-6 md:gap-10 ": isLong,
            })}
          >
            <div className={cn("w-full", { "md:w-1/2": isLong })}>
              <CardTitle className="text-xl font-bold text-gray-900">
                <motion.h1
                  variants={fadeIn("right", "spring", 0.3, 1)}
                  className="text-lg md:text-4xl font-bold mb-4 text-black max-w-sm"
                >
                  {title}
                </motion.h1>
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm md:text-lg">
                <motion.p variants={fadeIn("right", "spring", 0.4, 1)}>
                  {description}
                </motion.p>
              </CardDescription>
            </div>
            <div className={cn("w-full mt-6", { "md:w-1/2 md:mt-0": isLong })}>
              <AspectRatio
                ratio={16 / 9}
                className={cn(
                  "mx-auto flex items-center justify-center overflow-hidden",
                  {
                    "max-h-64 md:max-h-96": isLong,
                  }
                )}
              >
                <motion.div variants={zoomIn(0.4, 1)} className="w-full h-full">
                  <Image
                    src={imgUrl}
                    alt={imgAlt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AspectRatio>
            </div>
          </CardHeader>
        </motion.div>
      </Card>
    </motion.div>
  );
}

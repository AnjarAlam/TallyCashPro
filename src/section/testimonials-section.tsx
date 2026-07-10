"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Jane Doe",
    role: "Small Business Owner",
    image: "/placeholder.svg?height=50&width=50",
    fallback: "JD",
    text: "Cash Track has revolutionized how I manage my business finances. The insights are invaluable!",
  },
  {
    name: "Alex Smith",
    role: "Freelancer",
    image: "/placeholder.svg?height=50&width=50",
    fallback: "AS",
    text: "I used to dread budgeting, but Cash Track makes it so easy and even enjoyable. Highly recommend!",
  },
  {
    name: "Maria Brown",
    role: "Student",
    image: "/placeholder.svg?height=50&width=50",
    fallback: "MB",
    text: "Finally, an app that helps me understand where my money goes. Cash Track is a game-changer for students!",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-20 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-5 mb-14">
          <div className="inline-block rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-sm font-semibold text-white shadow ring-2 ring-offset-2 ring-primary/50 animate-pulse">
            What Our Users Say
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Trusted by Thousands
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            Hear from our satisfied customers who have transformed their financial lives with Cash Track.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="w-full sm:w-[300px] md:w-[280px]"
            >
              <Card className="hover:shadow-xl transition-shadow duration-300 border border-border bg-background/80 backdrop-blur rounded-2xl">
                <CardHeader className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                      {testimonial.fallback}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

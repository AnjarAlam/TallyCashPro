"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
};

const heroBackgroundClass =
  "absolute inset-0 z-0 bg-no-repeat bg-[url('/images/header/heroimage3.png')] bg-cover bg-[position:75%_center] sm:bg-[length:auto_120%] sm:bg-[position:right_center] lg:bg-[length:auto_135%]";

const heroBlurBackgroundClass =
  "absolute inset-0 z-0 blur-[6px] sm:blur-[12px] bg-no-repeat bg-[url('/images/header/heroimage2.png')] bg-cover bg-[position:75%_center] sm:bg-[length:auto_120%] sm:bg-[position:right_center] lg:bg-[length:auto_135%] [mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.5)_35%,rgba(0,0,0,0)_70%)] sm:[mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.4)_40%,rgba(0,0,0,0)_75%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.5)_35%,rgba(0,0,0,0)_70%)] sm:[-webkit-mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.4)_40%,rgba(0,0,0,0)_75%)]";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[440px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[680px] flex items-center overflow-hidden bg-slate-900">
      {/* Sharp background image (base layer) */}
      <div className={heroBackgroundClass} />

      {/* Blurred background image layer with gradient mask */}
      <div className={heroBlurBackgroundClass} />

      {/* Gradient overlay: stronger on mobile for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/30 sm:from-slate-900/85 sm:via-slate-900/45 sm:to-slate-900/10 lg:from-slate-900/80 lg:via-slate-900/35 lg:to-transparent" />

      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 lg:py-24 relative z-10">
        <motion.div
          className="flex flex-col items-start gap-4 sm:gap-5 md:gap-6 max-w-3xl text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/95 p-1 sm:p-1.5 pr-2.5 sm:pr-4 rounded-full shadow-md border border-white/20 max-w-full"
          >
            <span className="bg-[#0f172a] text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider shrink-0">
              New
            </span>
            <span className="text-[11px] sm:text-sm font-semibold text-slate-800 truncate">
              Personal & Business Finance Simplified
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-[1.65rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-[55.9px] font-medium font-stix text-white sm:leading-tight lg:leading-[62px] tracking-[-0.5px] sm:tracking-[-1px] lg:tracking-[-2px] capitalize"
          >
            Organize Every Cashflow Record {" "}
            <span className="block sm:inline">Your Way</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-slate-200/90 max-w-2xl leading-relaxed"
          >
            Create multiple books, customize categories, and keep every transaction structured — whether it's your household budget or your business accounts.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto pt-1 sm:pt-2"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-[#0ea5e9] to-[#10b981] hover:from-[#0284c7] hover:to-[#059669] text-white font-semibold rounded-full px-6 py-3 sm:px-8 sm:py-3.5 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all duration-200 text-sm sm:text-base cursor-pointer">
                Create account
              </button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border border-white/80 hover:border-white hover:bg-white/10 text-white font-semibold rounded-full px-6 py-3 sm:px-8 sm:py-3.5 transition-all duration-200 text-sm sm:text-base cursor-pointer">
                See Demo
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

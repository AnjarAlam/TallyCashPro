'use client';

import { motion, type Variants } from 'framer-motion';

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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function MultiUse() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="w-full max-w-[1178px] mx-auto">
        {/* Section Header */}
        <div className="text-left mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-[39.9px] font-medium font-stix text-[#1B4A61] leading-[110%] tracking-[-2px] capitalize">
            One Platform For Every Type Of<br className="hidden sm:inline" /> Business
          </h2>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-[12px] w-full justify-between"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1: Food & Beverage (Wide/Square) */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden w-full lg:w-[434px] h-[434px] shrink-0 group cursor-pointer bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src="/images/multiuse/image1.png"
              alt="Food & Beverage"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* 218px bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[218px] bg-gradient-to-t from-black to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute left-[30px] bottom-[29px] text-left">
              <span className="text-white font-semibold font-sans text-[27px] leading-[52px] tracking-[-0.32px] block">
                Food & Beverage
              </span>
            </div>
          </motion.div>

          {/* Card 2: Retail & Grocery */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden w-full lg:w-[236px] h-[434px] shrink-0 group cursor-pointer bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src="/images/multiuse/image2.png"
              alt="Retail & Grocery"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* 218px bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[218px] bg-gradient-to-t from-black to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute left-[24px] bottom-[37px] text-left">
              <span className="text-white font-semibold font-sans text-[27px] leading-[32px] tracking-[-0.32px] block">
                Retail &<br />Grocery
              </span>
            </div>
          </motion.div>

          {/* Card 3: Wholesale & Distribution */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden w-full lg:w-[236px] h-[434px] shrink-0 group cursor-pointer bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src="/images/multiuse/image3.png"
              alt="Wholesale & Distribution"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* 218px bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[218px] bg-gradient-to-t from-black to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute left-[24px] bottom-[37px] text-left">
              <span className="text-white font-semibold font-sans text-[27px] leading-[32px] tracking-[-0.32px] block">
                Wholesale &<br />Distribution
              </span>
            </div>
          </motion.div>

          {/* Card 4: Service Businesses */}
          <motion.div
            variants={cardVariants}
            className="relative overflow-hidden w-full lg:w-[236px] h-[434px] shrink-0 group cursor-pointer bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src="/images/multiuse/image4.png"
              alt="Service Businesses"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* 218px bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[218px] bg-gradient-to-t from-black to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute left-[24px] bottom-[37px] text-left">
              <span className="text-white font-semibold font-sans text-[27px] leading-[32px] tracking-[-0.32px] block">
                Service<br />Businesses
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

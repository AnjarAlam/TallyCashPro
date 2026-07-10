'use client';

import { motion, type Variants } from 'framer-motion';

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

export default function BusinessSupport() {
  return (
    <section className="w-full bg-white pt-12 sm:pt-20 md:pt-28 lg:pt-36 relative z-30">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        style={{ background: 'linear-gradient(93.83deg, #109DE5 4.44%, #1DB46B 100%)' }}
        className="relative w-full overflow-visible md:overflow-visible md:h-[316px] md:min-h-[316px] flex items-center justify-center pb-2 sm:pb-4 md:pb-0"
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center md:items-stretch justify-between relative md:h-full">
          {/* Text and CTA */}
          <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col items-start text-left z-30 gap-4 sm:gap-5 md:gap-6 py-8 sm:py-10 md:py-10 lg:py-0 md:justify-center shrink-0">
            <span className="text-white font-bold font-sans text-xs sm:text-sm md:text-[14px] leading-snug sm:leading-[25px] tracking-[-0.32px] uppercase">
             WE'RE HERE TO HELP
            </span>

            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full max-w-[476px]">
              <div className="flex flex-col gap-2 w-full">
                <h2 className="text-white font-semibold font-sans text-2xl sm:text-[28px] md:text-[32px] leading-tight md:leading-[32px] tracking-[-0.32px] capitalize">
                Real Support, For Real Life.
                </h2>
                <p className="text-white/95 font-medium font-sans text-sm sm:text-[15px] md:text-[16px] leading-relaxed sm:leading-[22px] tracking-[-0.32px]">
                Whether you're tracking personal savings or running daily business operations, our team is available to help you make the most of Tally Cash Pro.
                </p>
              </div>

              <button className="border border-white hover:bg-white hover:text-[#109DE5] text-white font-bold font-sans text-base sm:text-[17px] leading-[21px] tracking-[-0.01em] rounded-full px-6 py-3 sm:px-9 sm:py-4 w-full sm:w-fit sm:min-w-[167px] flex items-center justify-center transition-all duration-200 cursor-pointer">
                Get Started
              </button>
            </div>
          </div>

          {/* Desktop / tablet overlapping images */}
          <div className="absolute bottom-0 right-0 w-[45%] sm:w-[48%] lg:w-[50%] h-full min-h-[280px] md:min-h-0 md:h-[650px] overflow-hidden pointer-events-none hidden md:block z-20">
            <img
              src="/images/businessneed/businesssupportbg.png"
              alt=""
              className="absolute bottom-[-80px] lg:bottom-[-120px] right-[18%] lg:right-[22%] w-[180px] md:w-[200px] lg:w-[260px] xl:w-[285px] h-auto z-10 select-none pointer-events-none"
            />
            <img
              src="/images/businessneed/boylaptop.png"
              alt="Customer support representation"
              className="absolute bottom-[-60px] lg:bottom-[-100px] right-[2%] lg:right-[7%] w-[260px] md:w-[300px] lg:w-[390px] xl:w-[435px] h-auto max-w-[95%] z-20 select-none pointer-events-none -scale-x-100"
            />
          </div>

          {/* Mobile images — natural height so nothing is clipped */}
          <div className="relative w-full mt-4 sm:mt-6 flex justify-center items-end md:hidden z-20 px-2 pb-2">
            <div className="relative w-[min(100%,300px)] sm:w-[340px]">
              <div className="relative pt-[42%] sm:pt-[40%]">
                <img
                  src="/images/businessneed/businesssupportbg.png"
                  alt=""
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[56%] sm:w-[58%] h-auto z-10 select-none pointer-events-none"
                />
                <img
                  src="/images/businessneed/boylaptop.png"
                  alt="Customer support representation"
                  className="relative w-full h-auto z-20 select-none pointer-events-none -scale-x-100"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

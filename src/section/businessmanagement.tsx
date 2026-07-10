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

const cards = [
  {
    title: 'Track Cash In & Out',
    description:
      'Monitor money coming in and going out with complete visibility — across your home budget or your business.',
    image: '/images/businessneed/merged1.png',
    imageAlt: 'Track Cash In & Out mockup',
    bgGradient: 'from-[#a2ebd9] to-[#73d2be]',
  },
  {
    title: 'Multiple Books',
    description:
      'Organize personal expenses, family budgets, business transactions, customer records, and inventory — all from one centralized system.',
    image: '/images/businessneed/merged2.png',
    imageAlt: 'Multiple Books mockup',
    bgGradient: 'from-[#a2d8eb] to-[#7eb6ce]',
  },
  {
    title: 'PDF & Excel Reports',
    description:
      'Generate detailed reports and gain valuable insights to make smarter decisions, for your savings goals or your business growth.',
    image: '/images/businessneed/merged3.png',
    imageAlt: 'PDF & Excel Reports mockup',
    bgGradient: 'from-[#a2ebd9] to-[#73d2be]',
  },
];

export default function BusinessManagement() {
  return (
    <section id="business-management" className="scroll-mt-24 w-full py-12 sm:py-16 md:py-24 bg-white">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="text-left mb-8 sm:mb-12 md:mb-16">
          <span className="text-[#1DB46B] font-medium font-sans text-sm sm:text-base md:text-[18px] leading-snug sm:leading-[25px] tracking-[-0.32px] uppercase block mb-3 sm:mb-5">
            CASHFLOW MANAGEMENT PLATFORM
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[39.9px] font-medium font-stix text-[#1B4A61] leading-tight sm:leading-[100%] tracking-[-1px] sm:tracking-[-2px] capitalize">
            <span className="block mb-1 sm:mb-2 md:mb-4">Everything You Need,</span>
            <span className="block">All In One Place</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              variants={cardVariants}
              className={`bg-[#f8fbfd] border border-slate-100 rounded-2xl sm:rounded-[28px] lg:rounded-[32px] p-5 sm:p-6 lg:p-8 flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full ${
                index === cards.length - 1 ? 'md:col-span-2 xl:col-span-1 md:max-w-xl md:mx-auto xl:max-w-none xl:mx-0' : ''
              }`}
            >
              <div className="mb-8 md:mb-6 lg:mb-8">
                <h3 className="text-lg sm:text-xl md:text-[23px] font-semibold font-sans text-[#1B4A61] leading-snug sm:leading-[32px] tracking-[-0.32px] mb-2 sm:mb-3">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-[16px] font-medium font-sans text-[#1B4A61] leading-relaxed sm:leading-[22px] tracking-[-0.32px]">
                  {card.description}
                </p>
              </div>

              <div
                className={`relative w-full h-[240px] sm:h-[280px] md:h-[280px] lg:h-[320px] xl:h-[350px] overflow-hidden rounded-xl sm:rounded-[20px] lg:rounded-[24px] mt-auto bg-gradient-to-b ${card.bgGradient}`}
              >
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="absolute top-8 sm:top-10 md:top-auto bottom-0 left-1/2 -translate-x-1/2 w-[88%] sm:w-[86%] h-full md:h-auto md:max-h-full object-contain object-bottom select-none pointer-events-none"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

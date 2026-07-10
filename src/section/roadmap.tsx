'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const roadmapSteps = [
  {
    id: 'login',
    step: '01',
    title: 'Login',
    description:
      'Get started by signing in with your email. TallyCash Pro uses a secure, passwordless login so you can access your account quickly and safely.',
    image: '/images/roadmap/login1.png',
    imageAlt: 'TallyCash Pro login screen',
  },
  {
    id: 'verify-otp',
    step: '02',
    title: 'Verify OTP',
    description:
      'Enter the one-time password sent to your email to verify your identity. Once confirmed, you are securely logged in and ready to manage your finances.',
    image: '/images/roadmap/verifyotp1.png',
    imageAlt: 'Verify OTP screen',
  },
  {
    id: 'book-list',
    step: '03',
    title: 'Book List',
    description:
      'View all your cashbooks in one place. Switch between books, check balances at a glance, and open any book to start recording transactions.',
    image: '/images/roadmap/booklist1.png',
    imageAlt: 'Cashbook list screen',
  },
  {
    id: 'business-list',
    step: '04',
    title: 'Business List',
    description:
      'Manage multiple businesses from a single dashboard. Browse your business profiles, see key details, and select the one you want to work with.',
    image: '/images/roadmap/businesslist1.png',
    imageAlt: 'Business list screen',
  },
  {
    id: 'create-business',
    step: '05',
    title: 'Create Business',
    description:
      'Set up a new business in minutes. Add your business name, category, and preferences to create a dedicated workspace for tracking finances.',
    image: '/images/roadmap/createbusiness1.png',
    imageAlt: 'Create business screen',
  },
  {
    id: 'transactions',
    step: '06',
    title: 'Transaction List',
    description:
      'Record and review every income and expense. Add cash in, cash out, and transfers — with full details, categories, and payment modes for complete clarity.',
    image: '/images/roadmap/transactions1.png',
    imageAlt: 'Transaction list screen',
  },
  {
    id: 'analytics-reports',
    step: '07',
    title: 'Analytics & Reports',
    description:
      'Understand your financial performance with live analytics and visual summaries. Generate and download detailed PDF or Excel reports anytime you need them.',
    images: [
      { src: '/images/roadmap/analytics1.png', alt: 'Analytics dashboard screen' },
      { src: '/images/roadmap/downloadreport1.png', alt: 'Download report screen' },
    ],
  },
];

function RoadmapStepImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      style={{
        background:
          'radial-gradient(circle at center, rgba(16, 157, 229, 0.35) 0%, rgba(29, 180, 107, 0.18) 50%, #EBF4F8 100%)',
      }}
      className={`relative w-full max-w-[320px] sm:max-w-[360px] aspect-[9/16] rounded-[24px] sm:rounded-[28px] overflow-hidden flex items-center justify-center mx-auto ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={320}
        height={640}
        unoptimized
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[78%] h-auto object-contain object-bottom select-none pointer-events-none"
      />
    </div>
  );
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-24 w-full py-12 sm:py-16 md:py-24 bg-[#f8fbfd]">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-left mb-10 sm:mb-14 md:mb-16">
          <span className="text-[#1DB46B] font-medium font-sans text-sm sm:text-base md:text-[18px] leading-snug sm:leading-[25px] tracking-[-0.32px] uppercase block mb-3 sm:mb-5">
            Product Roadmap
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-[39.9px] font-medium font-stix text-[#1B4A61] leading-tight sm:leading-[100%] tracking-[-1px] sm:tracking-[-2px] capitalize mb-3 sm:mb-4">
            How TallyCash Pro Works
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-medium font-sans text-[#1B4A61]/80 leading-relaxed max-w-2xl">
            From login to insights — follow the complete flow to manage your personal or business
            finances step by step.
          </p>
        </div>

        <motion.div
          className="relative flex flex-col gap-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {roadmapSteps.map((item, index) => {
            const isEven = index % 2 === 1;
            const isLast = index === roadmapSteps.length - 1;
            const hasDualImages = 'images' in item && item.images;

            return (
              <motion.div key={item.id} variants={stepVariants} className="relative">
                {!isLast && (
                  <div
                    className={`hidden lg:block absolute top-[120px] w-px h-[calc(100%-40px)] bg-gradient-to-b from-[#109DE5]/40 to-[#1DB46B]/40 z-0 ${
                      isEven ? 'right-[calc(50%-0.5px)]' : 'left-[calc(50%-0.5px)]'
                    }`}
                  />
                )}

                <div
                  className={`flex flex-col gap-8 lg:gap-12 py-8 sm:py-10 lg:py-12 ${
                    isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } lg:items-center lg:justify-between`}
                >
                  <div className="w-full lg:w-[46%] flex flex-col items-start text-left lg:px-4">
                    <div className="inline-flex items-center gap-3 mb-4 sm:mb-5">
                      <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#109DE5] to-[#1DB46B] text-white font-bold font-sans text-sm sm:text-base shrink-0">
                        {item.step}
                      </span>
                      <div className="h-px w-8 sm:w-12 bg-[#1B4A61]/15 hidden sm:block" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-[28px] font-semibold font-sans text-[#1B4A61] leading-snug tracking-[-0.32px] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-[16px] font-medium font-sans text-[#1B4A61]/85 leading-relaxed sm:leading-[24px] tracking-[-0.32px] max-w-lg">
                      {item.description}
                    </p>
                  </div>

                  <div className="w-full lg:w-[46%] flex justify-center">
                    {hasDualImages ? (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-[760px]">
                        {item.images!.map((img) => (
                          <RoadmapStepImage key={img.src} src={img.src} alt={img.alt} />
                        ))}
                      </div>
                    ) : (
                      <RoadmapStepImage src={item.image!} alt={item.imageAlt!} />
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div className="flex justify-center lg:hidden pb-2">
                    <div className="w-px h-8 bg-gradient-to-b from-[#109DE5]/50 to-[#1DB46B]/50" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

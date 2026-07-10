'use client';

import { motion, type Variants } from 'framer-motion';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/app-store-links';

const features = [
  {
    label: 'Available On Mobile & Web',
    icon: (
      <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="14" height="10" rx="1.5" />
        <path d="M6 17h6" />
        <path d="M9 13v4" />
        <rect x="15" y="7" width="7" height="13" rx="1" fill="currentColor" fillOpacity="0.2" />
        <circle cx="18.5" cy="17.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Real-Time Data Sync',
    icon: (
      <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v8m0 0-3-3m3 3 3-3" />
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9Z" />
      </svg>
    ),
  },
  {
    label: 'Manage Everything On The Go',
    icon: (
      <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="1.5" />
        <path d="M10 9.5 12 8l3 1.5" />
        <path d="M10 12.5h3L15 17" />
        <path d="M12 12v3l-3 4" />
        <path d="M14 9.5l-2 3" />
      </svg>
    ),
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function TCPUse() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="w-full max-w-[1570px] mx-auto px-6 lg:px-8">
        <motion.div
          className="relative w-full min-h-[520px] lg:min-h-[549px] rounded-[30px] overflow-hidden"
          style={{
            background: 'linear-gradient(93.83deg, #109DE5 4.44%, #1DB46B 100%)',
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Left content */}
          <div className="relative z-10 flex flex-col items-start gap-[19px] w-full max-w-[400px] px-8 py-10 sm:px-10 lg:absolute lg:left-[210px] lg:top-1/2 lg:-translate-y-1/2 lg:px-0 lg:py-0 text-left">
            <h2 className="font-sans font-medium text-[28px] sm:text-[33.9px] leading-[36px] sm:leading-[42px] tracking-[-0.025em] text-white">
              Manage Your Cashflow From Anywhere, On Any Device
            </h2>

            <p className="font-sans font-normal text-[16px] leading-[24px] tracking-[-0.32px] text-white">
              Whether you&apos;re at home, at your shop, in the office, or traveling, Tally Cash Pro keeps your finances accessible and up to date across all your devices.
            </p>

            {features.map((feature, idx) => (
              <div
                key={feature.label}
                className={`flex items-center gap-4 w-full pb-4 ${
                  idx < features.length - 1 ? 'border-b border-white/20' : ''
                }`}
              >
                <div className="w-8 h-8 bg-white/30 rounded-[10px] flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <span className="font-sans font-semibold text-[16px] leading-[25px] tracking-[-0.32px] text-white">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* Large mockup — image1 */}
          <img
            src="/images/tcpuse/image1.png"
            alt="Tally Cash Pro on laptop and mobile"
            className="relative z-[1] block w-full max-w-[640px] mx-auto mt-2 lg:mt-0 lg:absolute lg:w-[1072px] lg:max-w-[72%] lg:h-auto lg:left-[29.7%] lg:-top-[103px] lg:mx-0 object-contain object-center lg:object-left-top pointer-events-none select-none"
          />
        </motion.div>

        {/* Download Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 sm:mt-14 md:mt-16 flex flex-col items-center text-center"
        >
          <p className="text-[#1DB46B] font-medium font-sans text-sm sm:text-base uppercase tracking-[-0.32px] mb-3">
            Download The App
          </p>
          <h3 className="text-2xl sm:text-3xl font-medium font-stix text-[#1B4A61] leading-tight tracking-[-1px] capitalize mb-3 max-w-xl">
            You Can Download TallyCash Pro
          </h3>
          <p className="text-sm sm:text-base font-medium font-sans text-[#1B4A61]/75 leading-relaxed max-w-lg mb-8">
            Get started on mobile — manage your finances on the go with our iOS and Android apps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black hover:bg-slate-900 text-white rounded-xl px-5 py-3 min-w-[200px] transition-colors duration-200"
            >
              <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <span className="block text-[10px] leading-tight opacity-80">Download on the</span>
                <span className="block text-lg font-semibold leading-tight">App Store</span>
              </div>
            </a>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black hover:bg-slate-900 text-white rounded-xl px-5 py-3 min-w-[200px] transition-colors duration-200"
            >
              <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M3.609 1.814 13.792 12 3.61 22.186a1.204 1.204 0 0 1-.465-.092 1.19 1.19 0 0 1-.666-1.083V3.089c0-.47.275-.898.666-1.083.39-.185.85-.148 1.164.092l8.977 6.813-8.977 6.903zM14.5 12.7l2.116 1.604 4.02-3.05-4.02-3.05L14.5 11.3zm0 0 2.116-1.604L20.636 7.05 16.616 4l-2.116 1.604L14.5 12.7z" />
              </svg>
              <div className="text-left">
                <span className="block text-[10px] leading-tight opacity-80">Get it on</span>
                <span className="block text-lg font-semibold leading-tight">Google Play</span>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

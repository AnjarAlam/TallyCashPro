'use client';

import { motion } from 'framer-motion';

// Custom high-fidelity SVGs matching Image 1
const ShieldLockIcon = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
    <path d="M10.5 11V9a1.5 1.5 0 0 1 3 0v2" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19A4.5 4.5 0 0 0 18 10h-1.26A8 8 0 1 0 4 15.25" />
    <path d="M12 10v9" />
    <path d="M9 13l3-3 3 3" />
  </svg>
);

const AccessibilityIcon = () => (
  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="6" r="2.2" />
    <path d="M6 12h12" />
    <path d="M12 8.2v7.8" />
    <path d="M9 22v-6l3-2.5 3 2.5v6" />
  </svg>
);

const HexagonGrid = () => (
  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hexagons" width="30" height="51.96" patternUnits="userSpaceOnUse">
        <path 
          d="M 30 0 L 15 8.66 L 0 0 L 0 17.32 L 15 25.98 L 30 17.32 Z M 0 25.98 L 15 34.64 L 0 43.3 L 0 60.62 L 15 69.28 L 30 60.62 L 30 43.3 L 15 34.64" 
          fill="none" 
          stroke="rgba(255,255,255,0.08)" 
          strokeWidth="1" 
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hexagons)" />
  </svg>
);

export default function Security() {
  const cards = [
    {
      title: "Bank-Grade Encryption",
      icon: ShieldLockIcon,
    },
    {
      title: "Cloud Backup & Sync",
      icon: CloudUploadIcon,
    },
    {
      title: "Role-Based Access Control",
      icon: AccessibilityIcon,
    }
  ];

  return (
    <section id="security" className="scroll-mt-24 w-full bg-[#000000] relative overflow-hidden py-16 md:py-0 md:h-[385px] flex items-center justify-center z-30">
      
      {/* Figma image 34: Hexagonal Grid Left Bottom */}
      <div className="absolute left-[-81px] top-[150px] w-[572px] h-[227px] pointer-events-none">
        <HexagonGrid />
      </div>

      {/* Figma image 35: Hexagonal Grid Right Top */}
      <div className="absolute right-[-81px] top-[-44px] w-[572px] h-[227px] pointer-events-none transform rotate-180">
        <HexagonGrid />
      </div>

      {/* Content Container */}
      <div className="w-full px-6 md:px-20 lg:px-[143px] flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-24 relative z-10">
        
        {/* Left Column: Frame 2147225998 */}
        <div className="flex flex-col items-start gap-4 text-left w-full lg:w-[404px]">
          <h2 className="text-white font-semibold font-sans text-[36px] sm:text-[46px] leading-[44px] sm:leading-[52px] tracking-[-0.32px]">
            Your Data is 100%<br />Safe
          </h2>
          <p className="text-white font-medium font-sans text-[16px] leading-[22px] tracking-[-0.32px] opacity-90">
            Protect your business records with enterprise-grade security, automatic backups, and controlled team access.
          </p>
        </div>

        {/* Right Column: Frame 2147226005 */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-[669px]">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="w-full sm:w-[212.33px] h-[201px] border border-white/20 rounded-[20px] flex items-center justify-center p-4 hover:border-white/40 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex flex-col items-center gap-7 w-[180.33px] h-[110px] justify-center">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <IconComponent />
                  </div>
                  <span className="text-white font-semibold font-sans text-[18px] sm:text-[19px] leading-[25px] tracking-[-0.32px] text-center">
                    {card.title}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

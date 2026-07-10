'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Can I track personal loans, IOUs, and customer credit (udhaar)?',
    answer:
      'Yes. TallyCash Pro lets you record personal loans, IOUs, and customer credit (udhaar) in dedicated ledgers. Track who owes you and who you owe, log payments as they happen, and keep every balance up to date in one place.',
  },
  {
    question: 'Can I manage inventory for my business?',
    answer:
      'Yes. You can add items, track stock inflows and outflows, and monitor inventory levels in real time — so you always know what is available and what needs restocking.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. Your data is protected with bank-grade encryption and secure cloud backups, so your personal and business records stay safe and are never lost.',
  },
  {
    question: 'Can multiple people use the same account? (e.g., family members or staff)',
    answer:
      'Yes. You can invite family members or staff to the same account with role-based access — such as Viewer, Editor, Partner, or Admin — so everyone can collaborate while keeping the right level of control.',
  },
  {
    question: 'Can I generate detailed financial reports?',
    answer:
      'Yes. Generate and download detailed PDF or Excel reports covering income, expenses, cash flow, ledgers, and more — giving you a clear picture of your personal or business finances anytime.',
  },
  {
    question: 'Is it suitable for personal use as well as small businesses?',
    answer:
      'Absolutely. TallyCash Pro is built for both personal finance and small business needs — whether you are managing household budgets, family expenses, freelance income, or day-to-day business operations.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function NewFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-24 w-full py-16 md:py-24 bg-white">
      <div className="w-full max-w-[1176px] mx-auto px-6 lg:px-0">
        
        {/* Two-Column Auto Layout */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-[49px] w-full max-w-[1146px] mx-auto">
          
          {/* Left Column (Frame 40) */}
          <div className="flex flex-col items-start gap-[23px] w-full lg:w-[530px] shrink-0 text-left">
            
            {/* FAQ's Link Pill */}
            <div className="box-sizing-border-box flex flex-row items-center px-[12px] py-[6px] gap-[8px] bg-[#FAFAFA] border border-[#E6E6E6] rounded-[100px] h-[33px]">
              <span className="font-sans font-medium text-[14px] leading-[21px] tracking-[-0.28px] text-[#888888]">
                FAQ’s
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-[#1C1C1C] font-semibold font-sans text-[36px] sm:text-[42.9px] leading-[44px] sm:leading-[56px] tracking-[-0.025em] block">
              Got questions?<br />
              <span className="text-[#0088FF]">We’re here to help!</span>
            </h2>

            {/* Description Paragraph */}
            <p className="font-sans font-normal text-[16px] leading-[24px] tracking-[-0.32px] text-[#888888] block">
              Get quick answers to common questions about our app, fees, security, and account features. Can't find what you're looking for? Our support team is here to help 24/7.
            </p>
          </div>

          {/* Right Column (Frame 42) */}
          <motion.div
            className="flex flex-col gap-[19px] w-full lg:w-[567px] shrink-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {faqData.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  className="relative flex flex-col w-full bg-[#FAFAFA] rounded-[12px] overflow-hidden transition-all duration-300 border border-transparent hover:border-gray-200/50"
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between p-[24px] text-left focus:outline-none cursor-pointer gap-[19px] min-h-[72px]"
                  >
                    {/* Question Text */}
                    <span className="font-sans font-semibold text-[16px] leading-[24px] tracking-[-0.32px] text-[#1C1C1C]">
                      {item.question}
                    </span>
                    
                    {/* Expand/Collapse Button Indicator */}
                    <div className="relative w-[24px] h-[24px] bg-white rounded-[4px] flex items-center justify-center shrink-0 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-gray-100/60">
                      {/* Horizontal bar */}
                      <div className="absolute w-[10px] h-[2px] bg-[#1C1C1C]" />
                      {/* Vertical bar (hides when open) */}
                      <motion.div
                        className="absolute w-[2px] h-[10px] bg-[#1C1C1C]"
                        animate={{ scaleY: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      />
                    </div>
                  </button>

                  {/* Accordion Content Panel */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-[24px] pb-[24px] pt-0 font-sans font-medium text-[15px] sm:text-[16px] leading-[24px] text-[#888888] border-t border-gray-200/20 pt-[16px]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </section>
  );
}

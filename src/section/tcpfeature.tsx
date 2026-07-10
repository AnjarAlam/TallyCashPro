'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface TabItem {
  id: string;
  title: string;
  description: string;
}

interface FeatureSectionData {
  id: string;
  heading: React.ReactNode;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  tabs: TabItem[];
}

const featureSections: FeatureSectionData[] = [
  {
    id: 'income',
    heading: 'Record Every Income, Big or Small',
    description:
      'Capture sales, service payments, rental income, salary, freelance earnings, or any other income in seconds. Keep every incoming transaction organized and easily accessible.',
    image: '/images/feature/image1.png',
    imageAlt: 'Income tracking categories screen',
    imagePosition: 'right',
    tabs: [
      {
        id: 'income-tracking',
        title: 'Income Tracking',
        description: 'Record cash, bank, and UPI payments as they happen.',
      },
      {
        id: 'ledgers',
        title: 'Customer & Contact Ledgers',
        description:
          'Maintain clear records of what customers and contacts owe you, track credit (udhaar), and log payments as balances change.',
      },
      {
        id: 'books-management',
        title: 'Multiple Books Management',
        description:
          'Create separate books for personal, business, or client accounts and switch between them seamlessly.',
      },
    ],
  },
  {
    id: 'insights',
    heading: 'Understand Your Cashflow Better',
    description:
      'Transform everyday transactions — personal or business — into meaningful insights that help you understand spending habits, income trends, and growth opportunities.',
    image: '/images/feature/image2.png',
    imageAlt: 'Financial activity report screen',
    imagePosition: 'left',
    tabs: [
      {
        id: 'live-overview',
        title: 'Live Financial Overview',
        description: 'Monitor income, expenses, and net balance in real time.',
      },
      {
        id: 'visual-tracking',
        title: 'Visual Performance Tracking',
        description:
          'Track income trends, spending patterns, and performance with clear visual summaries at a glance.',
      },
      {
        id: 'advanced-reports',
        title: 'Advanced Reports',
        description:
          'Generate detailed PDF and Excel reports to support smarter decisions for your savings or business growth.',
      },
    ],
  },
  {
    id: 'expenses',
    heading: 'Track Expenses With Complete Clarity',
    description:
      'Monitor daily spending, household bills, business costs, vendor payments, and other outgoing transactions — all from a single platform.',
    image: '/images/feature/image33.png',
    imageAlt: 'Expense tracking screen',
    imagePosition: 'right',
    tabs: [
      {
        id: 'expense-management',
        title: 'Expense Management',
        description: 'Track and categorize expenses for better financial visibility.',
      },
      {
        id: 'vendor-tracking',
        title: 'Vendor & Bill Tracking',
        description:
          'Keep supplier payments, vendor records, and outstanding bills organized in one place.',
      },
      {
        id: 'invoice-storage',
        title: 'Invoice & Receipt Storage',
        description:
          'Store invoices and receipts for easy reference, reconciliation, and audit-ready record keeping.',
      },
    ],
  },
  {
    id: 'organize',
    heading: 'Organize Cashflow The Way You Want',
    description:
      'Create separate books and categories for business operations, side projects, family expenses, personal budgets, or any financial activity you want to manage independently.',
    image: '/images/feature/image4.png',
    imageAlt: 'Multiple books management screen',
    imagePosition: 'left',
    tabs: [
      {
        id: 'multiple-books',
        title: 'Multiple Books Management',
        description: 'Maintain separate books for branches, projects, accounts, or daily life.',
      },
      {
        id: 'custom-categories',
        title: 'Custom Categories',
        description:
          'Create categories that match how you actually earn, spend, and manage money — personal or business.',
      },
      {
        id: 'record-organization',
        title: 'Simplified Record Organization',
        description:
          'Keep every transaction structured and easy to find when you need it, across all your books.',
      },
    ],
  },
];

function FeatureBlock({ section }: { section: FeatureSectionData }) {
  const [activeTab, setActiveTab] = useState(0);

  const textContent = (
    <div className="w-full lg:w-[472px] flex flex-col gap-[84px] text-left shrink-0">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium font-stix text-[#1B4A61] text-[32px] sm:text-[39.9px] leading-[42px] sm:leading-[50px] tracking-[-2px] capitalize">
          {section.heading}
        </h2>
        <p className="font-sans font-medium text-[16px] sm:text-[18px] leading-[22px] sm:leading-[25px] tracking-[-0.32px] text-[#1B4A61] max-w-[472px]">
          {section.description}
        </p>
      </div>

      <div className="flex flex-col w-full max-w-[509px]">
        {section.tabs.map((tab, idx) => {
          const isActive = activeTab === idx;
          return (
            <div
              key={tab.id}
              className={`relative border-b border-[#1B4A61]/20 ${
                isActive ? 'pb-6' : 'py-6'
              }`}
            >
              <button
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left font-sans text-[18px] leading-[25px] tracking-[-0.32px] transition-colors duration-200 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-[#1B4A61] font-semibold'
                    : 'text-[#1B4A61] font-semibold hover:text-[#1B4A61]/80'
                }`}
              >
                {tab.title}
              </button>

              <AnimatePresence initial={false}>
                {isActive && tab.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="font-sans font-medium text-[16px] leading-[22px] tracking-[-0.32px] text-[#1B4A61] mt-2 max-w-[509px]">
                      {tab.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {isActive && (
                <div className="absolute bottom-0 left-0 w-[196px] h-[3px] bg-[#1B4A61]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const phoneImageClassName =
    section.imagePosition === 'left'
      ? 'absolute top-[72px] lg:top-[88px] w-[65%] h-auto object-contain select-none pointer-events-none left-1/2 -translate-x-1/2'
      : 'absolute bottom-[40px] w-[65%] h-auto object-contain select-none pointer-events-none left-1/2 -translate-x-1/2';

  const imageContent = (
    <div className="w-full lg:w-[586px] shrink-0 flex items-center justify-center">
      <div
        style={{
          background:
            'radial-gradient(circle at center, rgba(16, 157, 229, 0.48) 0%, rgba(29, 180, 107, 0.22) 50%, #EBF4F8 100%)',
        }}
        className="relative w-full max-w-[586px] aspect-square rounded-[32px] overflow-hidden flex items-center justify-center"
      >
        <Image
          key={section.id}
          src={section.image}
          alt={section.imageAlt}
          width={402}
          height={819}
          unoptimized
          className={phoneImageClassName}
        />
      </div>
    </div>
  );

  return (
    <div
      className={`flex flex-col lg:flex-row justify-between gap-12 lg:gap-[72px] w-full max-w-[1147px] min-h-[586px] mx-auto ${
        section.imagePosition === 'left' ? 'lg:items-start' : 'lg:items-center'
      }`}
    >
      {section.imagePosition === 'left' ? (
        <>
          {imageContent}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {imageContent}
        </>
      )}
    </div>
  );
}

export default function TCPFeature() {
  return (
    <section id="features" className="scroll-mt-24 w-full bg-white py-16 md:py-24">
      <div className="w-full max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-[72px] lg:gap-[102px] w-full max-w-[1147px] mx-auto">
          {featureSections.map((section) => (
            <FeatureBlock key={section.id} section={section} />
          ))}
        </div>
      </div>
    </section>
  );
}

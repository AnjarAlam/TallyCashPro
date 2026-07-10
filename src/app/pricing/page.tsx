'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Check, X, HelpCircle, Sparkles, Shield, ArrowRight, Info, Zap, Users, BarChart3, Database } from 'lucide-react';
import Header from '@/section/header';
import NewFooter from '@/section/newfooter';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  badge?: string;
  description: string;
  priceMonthly: number;
  priceAnnually: number;
  features: PricingFeature[];
  ctaText: string;
  ctaHref: string;
  isPopular: boolean;
  colorScheme: 'light' | 'dark' | 'emerald';
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for personal cash flow tracking and solopreneurs getting started.',
    priceMonthly: 0,
    priceAnnually: 0,
    ctaText: 'Get Started Free',
    ctaHref: '/signup',
    isPopular: false,
    colorScheme: 'light',
    features: [
      { text: '1 Cash Book / Ledger', included: true },
      { text: 'Up to 50 Transactions/month', included: true },
      { text: 'Basic Income & Expense tracking', included: true },
      { text: 'Single device access', included: true },
      { text: 'Web & Mobile app access', included: true },
      { text: 'Real-time multi-device sync', included: false },
      { text: 'PDF & Excel financial reports', included: false },
      { text: 'Customer credit (Udhaar) tracking', included: false },
      { text: 'Staff collaboration & roles', included: false },
    ],
  },
  {
    name: 'Pro',
    badge: 'Most Popular',
    description: 'For growing businesses and individuals seeking full control and advanced insights.',
    priceMonthly: 9,
    priceAnnually: 7.2,
    ctaText: 'Start Free Trial',
    ctaHref: '/signup?plan=pro',
    isPopular: true,
    colorScheme: 'dark',
    features: [
      { text: 'Unlimited Cash Books / Ledgers', included: true },
      { text: 'Unlimited Transactions', included: true },
      { text: 'Automated category suggestions', included: true },
      { text: 'Real-time multi-device sync', included: true },
      { text: 'PDF & Excel financial reports', included: true },
      { text: 'Customer credit (Udhaar) tracking', included: true },
      { text: 'Up to 3 staff members / roles', included: true },
      { text: 'Offline mode with auto-sync', included: true },
      { text: 'Priority email support', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For teams, multi-store operations, and businesses needing inventory tracking.',
    priceMonthly: 29,
    priceAnnually: 23.2,
    ctaText: 'Contact Sales',
    ctaHref: '/signup?plan=enterprise',
    isPopular: false,
    colorScheme: 'emerald',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited staff members & roles', included: true },
      { text: 'Inventory tracking & Stock alerts', included: true },
      { text: 'Custom branding on reports', included: true },
      { text: 'Priority 24/7 chat & phone support', included: true },
      { text: 'API access for integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom training session', included: true },
      { text: 'SLA guarantee', included: true },
    ],
  },
];

interface ComparisonFeature {
  name: string;
  starter: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

interface ComparisonCategory {
  title: string;
  icon: React.ReactNode;
  features: ComparisonFeature[];
}

const comparisonData: ComparisonCategory[] = [
  {
    title: 'Core Limits & Books',
    icon: <Database className="w-5 h-5 text-[#0088FF]" />,
    features: [
      { name: 'Cash Books / Ledgers', starter: '1 Book', pro: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Monthly Transactions', starter: '50 / month', pro: 'Unlimited', enterprise: 'Unlimited' },
      { name: 'Data Storage', starter: '100 MB', pro: '5 GB', enterprise: 'Unlimited' },
      { name: 'Backup Frequency', starter: 'Daily', pro: 'Real-time', enterprise: 'Real-time' },
    ],
  },
  {
    title: 'Features & Workflows',
    icon: <Zap className="w-5 h-5 text-[#1DB46B]" />,
    features: [
      { name: 'Income & Expense tracking', starter: true, pro: true, enterprise: true },
      { name: 'Web & Mobile app access', starter: true, pro: true, enterprise: true },
      { name: 'Real-time Multi-device sync', starter: false, pro: true, enterprise: true },
      { name: 'Offline mode with Auto-sync', starter: false, pro: true, enterprise: true },
      { name: 'Customer Credit (Udhaar)', starter: false, pro: true, enterprise: true },
      { name: 'Automated Category Suggestions', starter: false, pro: true, enterprise: true },
      { name: 'Inventory & Stock Alerts', starter: false, pro: false, enterprise: true },
    ],
  },
  {
    title: 'Collaboration & Roles',
    icon: <Users className="w-5 h-5 text-purple-500" />,
    features: [
      { name: 'Staff members included', starter: '1 User', pro: 'Up to 3 Users', enterprise: 'Unlimited' },
      { name: 'Custom Member Roles', starter: false, pro: true, enterprise: true },
      { name: 'Activity Audit Logs', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    title: 'Reporting & Analytics',
    icon: <BarChart3 className="w-5 h-5 text-amber-500" />,
    features: [
      { name: 'PDF Reports', starter: 'Basic only', pro: 'Detailed with exports', enterprise: 'Custom branded' },
      { name: 'Excel Exports', starter: false, pro: true, enterprise: true },
      { name: 'Enhanced Cashflow Analytics', starter: false, pro: true, enterprise: true },
      { name: 'Custom Branding', starter: false, pro: false, enterprise: true },
    ],
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How does the 14-day trial work?',
    answer: 'You can sign up for a Pro plan trial without entering your credit card details. You will have full access to all Pro features for 14 days. At the end of the trial, you can choose to subscribe or downgrade to the free Starter plan.',
  },
  {
    question: 'Can I change plans or cancel my subscription later?',
    answer: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings. If you upgrade, the change is immediate and pro-rated. If you cancel, your subscription will remain active until the end of your billing period.',
  },
  {
    question: 'What happens to my data if I downgrade to the Starter plan?',
    answer: 'Your data is safe. If you downgrade to the Starter plan, your existing cashbooks and transactions remain preserved. However, if you exceed the Starter limits (e.g. more than 1 cashbook or 50 transactions/month), you won\'t be able to add new books or transactions until you either delete books to meet the limits or upgrade back to Pro.',
  },
  {
    question: 'Is my financial data secure?',
    answer: 'Yes. We protect your personal and business records with industry-standard AES-256 bank-grade encryption, secure transport protocols (HTTPS/TLS), and regular automated cloud backups. Your financial privacy is our top priority.',
  },
  {
    question: 'Do you offer custom pricing for large operations?',
    answer: 'Yes. For businesses with dozens of stores, hundreds of staff members, or custom integration needs, we offer custom enterprise volume limits. Please contact our support or sales team to discuss a tailored plan.',
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const headingVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
              <Header />
            </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 border-b border-gray-150/60 bg-[#FAFAFA]">
        {/* Animated fluid blur elements */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <motion.div 
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-[100px] -left-[100px] w-[500px] h-[500px] rounded-full bg-[#109DE5]/10 blur-[110px]" 
          />
          <motion.div 
            animate={{
              x: [0, -40, 40, 0],
              y: [0, 40, -40, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[20%] right-[-100px] w-[450px] h-[450px] rounded-full bg-[#1DB46B]/8 blur-[100px]" 
          />
        </div>

        <div className="w-full max-w-[1240px] mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E6E6E6] rounded-full shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#0088FF] animate-pulse" />
            <span className="font-sans font-semibold text-[13px] tracking-tight text-slate-600">
              Pricing Plans for Everyone
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={headingVariants}
            className="text-[#1B4A61] font-semibold font-sans text-4xl sm:text-5xl lg:text-[62px] leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6"
          >
            Smarter cashflow tracking,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#109DE5] via-[#0088FF] to-[#1DB46B] bg-300% animate-gradient">
              designed to scale with your business
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-sans font-medium text-base sm:text-lg leading-relaxed text-slate-500 max-w-xl mx-auto mb-10"
          >
            No hidden contracts. No setup fees. Start free, upgrade as you grow, and downgrade or cancel anytime.
          </motion.p>

          {/* Sliding interactive Billing Switch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm w-fit mx-auto relative"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold tracking-tight transition-colors duration-300 cursor-pointer ${
                billingCycle === 'monthly' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div
                  layoutId="billing-highlight"
                  className="absolute inset-0 bg-slate-900 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-semibold tracking-tight transition-colors duration-300 flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'annually' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {billingCycle === 'annually' && (
                <motion.div
                  layoutId="billing-highlight"
                  className="absolute inset-0 bg-slate-900 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              Annually billing
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none transition-all duration-300 ${
                billingCycle === 'annually' ? 'bg-[#1DB46B] text-white' : 'bg-[#1DB46B]/10 text-[#1DB46B]'
              }`}>
                Save 20%
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards Grid Section with Floating Blur Background */}
      <section className="py-24 w-full bg-[#f8fbfd] border-b border-gray-100 relative overflow-hidden">
        {/* Floating gradient light leaks */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div 
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-[100px] left-[10%] w-[350px] h-[350px] rounded-full bg-[#109DE5]/10 blur-[120px]" 
          />
          <motion.div 
            animate={{
              x: [0, -30, 40, 0],
              y: [0, 40, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-[100px] right-[10%] w-[350px] h-[350px] rounded-full bg-[#1DB46B]/8 blur-[120px]" 
          />
        </div>

        <div className="w-full max-w-[1240px] mx-auto px-6 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 items-stretch w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {pricingPlans.map((plan) => {
              const price = billingCycle === 'annually' ? plan.priceAnnually : plan.priceMonthly;
              const originalPrice = plan.priceMonthly;
              const showDiscount = billingCycle === 'annually' && plan.priceMonthly > 0;

              let cardStyle = '';
              let headerTextStyle = '';
              let priceStyle = '';
              let descStyle = '';
              let btnStyle = '';
              let checkStyle = '';

              if (plan.colorScheme === 'dark') {
                cardStyle = 'bg-[#0B2265] text-white border-transparent z-10 relative';
                headerTextStyle = 'text-white';
                priceStyle = 'text-white';
                descStyle = 'text-slate-300';
                btnStyle = 'bg-gradient-to-r from-[#109DE5] to-[#1DB46B] text-white hover:opacity-95 border-transparent shadow-md shadow-emerald-500/10 hover:shadow-lg';
                checkStyle = 'text-[#1DB46B] bg-emerald-500/10';
              } else if (plan.colorScheme === 'emerald') {
                cardStyle = 'bg-white text-slate-800 border-emerald-100/70 shadow-sm z-0';
                headerTextStyle = 'text-[#0B2265]';
                priceStyle = 'text-[#0B2265]';
                descStyle = 'text-slate-500';
                btnStyle = 'bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-sm hover:shadow-md';
                checkStyle = 'text-emerald-600 bg-emerald-500/10';
              } else {
                cardStyle = 'bg-white text-slate-800 border-slate-100 shadow-sm z-0';
                headerTextStyle = 'text-[#0B2265]';
                priceStyle = 'text-[#0B2265]';
                descStyle = 'text-slate-500';
                btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm';
                checkStyle = 'text-blue-600 bg-blue-500/10';
              }

              return (
                <motion.div
                  key={plan.name}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    scale: plan.isPopular ? 1.035 : 1.025,
                    boxShadow: plan.colorScheme === 'dark' 
                      ? "0 30px 60px -10px rgba(11,34,101,0.5)" 
                      : "0 30px 60px -15px rgba(0,0,0,0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex flex-col rounded-[28px] border p-8 transition-all duration-300 ${cardStyle} ${
                    plan.isPopular ? 'md:-translate-y-4 shadow-md' : ''
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#109DE5] to-[#1DB46B] text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md z-25">
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className={`font-sans font-bold text-2xl tracking-tight mb-2 ${headerTextStyle}`}>
                      {plan.name}
                    </h3>
                    <p className={`font-sans text-[13.5px] font-normal leading-relaxed min-h-[48px] ${descStyle}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Animated pricing shift */}
                  <div className="flex items-baseline gap-1.5 mb-8 overflow-hidden h-[50px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`font-sans font-extrabold text-[42px] leading-none tracking-tight ${priceStyle}`}
                      >
                        ${price === 0 ? '0' : price.toFixed(2)}
                      </motion.span>
                    </AnimatePresence>
                    <span className={`font-sans text-xs font-semibold ${plan.colorScheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      /month
                    </span>

                    <AnimatePresence>
                      {showDiscount && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="ml-2 flex items-center"
                        >
                          <span className="line-through text-sm text-slate-400 font-semibold">
                            ${originalPrice.toFixed(2)}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <a
                    href={plan.ctaHref}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold font-sans text-[14.5px] flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer mb-8 hover:scale-[1.01] ${btnStyle}`}
                  >
                    {plan.ctaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <hr className={`border-t mb-8 ${plan.colorScheme === 'dark' ? 'border-white/10' : 'border-slate-100'}`} />

                  {/* Features list with staggered checks */}
                  <ul className="space-y-4 flex-grow">
                    {plan.features.slice(0, 8).map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-3 text-[14px] font-sans leading-normal ${!feature.included
                            ? 'opacity-35 line-through text-slate-400'
                            : plan.colorScheme === 'dark'
                              ? 'text-slate-200'
                              : 'text-slate-600'
                          }`}
                      >
                        <motion.div 
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className={`p-0.5 rounded-full mt-0.5 shrink-0 ${checkStyle}`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </motion.div>
                        <span className="font-medium tracking-tight">
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-24 w-full bg-white">
        <div className="w-full max-w-[1024px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <h2 className="text-[#1B4A61] font-semibold font-sans text-3xl sm:text-4xl tracking-tight mb-4">
              Compare plans and features
            </h2>
            <p className="font-sans text-sm text-slate-500 leading-relaxed">
              Find the perfect plan for you or your company. Take a look at the comprehensive feature breakdown.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full bg-white rounded-3xl border border-gray-200/80 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-slate-50/50">
                    <th className="p-5 font-sans font-bold text-slate-700 text-sm w-1/3">Feature</th>
                    <th className="p-5 font-sans font-bold text-[#0B2265] text-sm text-center">Starter</th>
                    <th className="p-5 font-sans font-bold text-[#0088FF] text-sm text-center">Pro</th>
                    <th className="p-5 font-sans font-bold text-emerald-600 text-sm text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((category) => (
                    <React.Fragment key={category.title}>
                      <tr className="bg-slate-50/70 border-b border-gray-100">
                        <td colSpan={4} className="p-4 px-5 font-sans font-bold text-slate-800 text-sm">
                          <span className="flex items-center gap-2">
                            {category.icon}
                            {category.title}
                          </span>
                        </td>
                      </tr>
                      {category.features.map((feature) => (
                        <tr
                          key={feature.name}
                          className="border-b border-gray-100/50 hover:bg-slate-50/20 last:border-b-0 transition-colors duration-205"
                        >
                          <td className="p-4 px-5 font-sans font-medium text-slate-600 text-sm">
                            {feature.name}
                          </td>
                          <td className="p-4 text-center font-sans text-slate-500 text-sm">
                            {renderVal(feature.starter)}
                          </td>
                          <td className="p-4 text-center font-sans font-medium text-slate-700 text-sm">
                            {renderVal(feature.pro)}
                          </td>
                          <td className="p-4 text-center font-sans font-medium text-emerald-700 text-sm">
                            {renderVal(feature.enterprise)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing FAQs Section (Two-Column Side-by-Side Professional Layout) */}
      <section id="faq" className="scroll-mt-24 w-full py-20 md:py-28 bg-[#f8fbfd] border-t border-b border-gray-150/60">
        <div className="w-full max-w-[1176px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-[49px] w-full mx-auto">
            
            {/* Left Column (Question Header Info) */}
            <div className="flex flex-col items-start gap-5 w-full lg:w-[480px] shrink-0 text-left">
              <div className="flex flex-row items-center px-[12px] py-[6px] gap-[8px] bg-white border border-[#E6E6E6] rounded-[100px] h-[33px] shadow-sm">
                <span className="font-sans font-medium text-[14px] leading-[21px] tracking-[-0.28px] text-[#888888] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#0088FF]" /> FAQ
                </span>
              </div>

              <h2 className="text-[#1B4A61] font-semibold font-sans text-[36px] sm:text-[42px] leading-tight tracking-tight block">
                Got pricing questions?<br />
                <span className="text-[#0088FF]">We’re here to help!</span>
              </h2>

              <p className="font-sans font-medium text-[15px] sm:text-[16px] leading-[24px] tracking-tight text-slate-500 max-w-sm block">
                Get quick answers to common questions about our plans, billing cycle, refunds, and team collaborations. Can't find what you're looking for? Reach out to our support team.
              </p>
            </div>

            {/* Right Column (Accordion List) */}
            <motion.div
              className="flex flex-col gap-4 w-full lg:w-[580px] shrink-0"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              {faqData.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="relative flex flex-col w-full bg-white rounded-2xl overflow-hidden transition-all duration-300 border border-gray-150/50 shadow-sm hover:shadow hover:border-gray-300/80"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-sans font-semibold text-[#1C1C1C] hover:text-slate-900 transition-colors gap-4 cursor-pointer min-h-[72px]"
                    >
                      <span className="text-[15px] sm:text-[16.5px] leading-snug tracking-tight text-slate-800">
                        {item.question}
                      </span>
                      <div className="w-6 h-6 rounded-md bg-slate-50 border border-gray-200/60 shadow-sm flex items-center justify-center shrink-0">
                        <motion.span 
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-lg leading-none font-medium flex items-center justify-center text-slate-800"
                        >
                          {isOpen ? '−' : '+'}
                        </motion.span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-gray-100/60 text-[14px] sm:text-[15px] text-slate-500 leading-relaxed pt-4">
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
      <NewFooter />
    </div>
  );
}

// Render helper for comparison table values
import React from 'react';
function renderVal(val: string | boolean) {
  if (typeof val === 'boolean') {
    return val ? (
      <span className="inline-flex p-1 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
        <Check className="w-4 h-4 stroke-[3]" />
      </span>
    ) : (
      <span className="inline-flex p-1 rounded-full bg-red-500/10 text-red-500 mx-auto">
        <X className="w-4 h-4 stroke-[3]" />
      </span>
    );
  }
  return <span className="text-[13.5px] font-semibold">{val}</span>;
}

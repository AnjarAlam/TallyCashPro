'use client';

import { motion, type Variants } from 'framer-motion';
import { Sparkles, ArrowRight, Store, ShoppingBag, Truck, UserCheck, ShieldCheck, Zap, Users, BarChart3, Database, Check } from 'lucide-react';
import Header from '@/section/header';
import NewFooter from '@/section/newfooter';

interface SolutionDetails {
  title: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  features: string[];
  color: string;
}

const solutionsList: SolutionDetails[] = [
  {
    title: 'Retail Stores & Shops',
    icon: <Store className="w-8 h-8 text-[#0088FF]" />,
    tagline: 'Optimize Daily Over-the-Counter Sales',
    description: 'Keep track of daily cash sales, credit purchases (Udhaar), customer ledger balances, and receive instant digital payments with zero transaction fees.',
    color: '#0088FF',
    features: [
      'Record customer credit & send automated payment reminders',
      'Manage multiple staff logins with restricted cashbook access',
      'Generate instant PDF/Excel receipts for customers',
      'Daily summaries & night closing cash tally reports',
    ],
  },
  {
    title: 'Wholesalers & Bulk Traders',
    icon: <ShoppingBag className="w-8 h-8 text-[#1DB46B]" />,
    tagline: 'High Volume Ledger Management',
    description: 'Easily track multi-million credit balances, manage bulk buyer ledgers, automate outstanding payments collection, and share statement summaries.',
    color: '#1DB46B',
    features: [
      'Unlimited books for separate suppliers & buyers',
      'Bulk purchase record entries & transaction tags',
      'Automated reconciliation of partial payouts',
      'Detailed ledger balance statements via WhatsApp/Email',
    ],
  },
  {
    title: 'Distributors & Agencies',
    icon: <Truck className="w-8 h-8 text-amber-500" />,
    tagline: 'Field Staff & Supply Chain Cash Sync',
    description: 'Empower delivery agents or sales executives to collect cash and update ledgers in real time from the field, even with low network connectivity.',
    color: '#F59E0B',
    features: [
      'Offline transactions support with auto-sync when online',
      'Role-based permissions (Editor, Viewer, Partner)',
      'Route-wise sales & collection reports tracking',
      'Detailed audit trails of who made each ledger update',
    ],
  },
  {
    title: 'Freelancers & Solopreneurs',
    icon: <UserCheck className="w-8 h-8 text-purple-500" />,
    tagline: 'Separate Personal & Work Ledgers',
    description: 'Perfect for consultants, agencies, and small service providers to track professional invoicing balances separately from personal expenses.',
    color: '#8B5CF6',
    features: [
      'Unified Dashboard for personal budgets and business invoices',
      'Categorized tax-deductible expense tracking',
      'Recurring payment reminders and scheduling',
      'Secure multi-device sync (Web, Android, iOS)',
    ],
  },
];

export default function SolutionsPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.08,
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

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Header />
      </header>

      {/* Solutions Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 border-b border-gray-150/60 bg-[#FAFAFA]">
        {/* Decorative Fluid Blurs */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <motion.div 
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-[100px] -left-[100px] w-[500px] h-[500px] rounded-full bg-[#109DE5]/10 blur-[110px]" 
          />
          <motion.div 
            animate={{
              x: [0, -40, 40, 0],
              y: [0, 40, -40, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
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
            <Sparkles className="w-4 h-4 text-[#0088FF]" />
            <span className="font-sans font-semibold text-[13px] tracking-tight text-slate-600">
              Tailored Financial Management
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#1B4A61] font-semibold font-sans text-4xl sm:text-5xl lg:text-[62px] leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6"
          >
            Cashflow solutions built for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#109DE5] via-[#0088FF] to-[#1DB46B]">
              your specific business type
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-sans font-medium text-base sm:text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto"
          >
            TallyCash Pro simplifies bookkeeping, tracks credits, manages inventory, and keeps your finances reconciled, regardless of scale.
          </motion.p>
        </div>
      </section>

      {/* Solutions Details Grid */}
      <section className="py-24 w-full bg-white relative">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {solutionsList.map((sol, index) => (
              <motion.div
                key={sol.title}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)"
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-white border border-gray-150 rounded-[28px] p-8 md:p-10 flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="p-3.5 rounded-2xl shrink-0"
                      style={{ backgroundColor: `${sol.color}12` }}
                    >
                      {sol.icon}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {sol.tagline}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#1B4A61]">
                        {sol.title}
                      </h3>
                    </div>
                  </div>

                  <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-slate-500 mb-8">
                    {sol.description}
                  </p>

                  <hr className="border-t border-slate-100 mb-8" />

                  <ul className="space-y-4 mb-8">
                    {sol.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] text-slate-600 leading-normal">
                        <div 
                          className="p-0.5 rounded-full mt-0.5 shrink-0" 
                          style={{ backgroundColor: `${sol.color}12`, color: sol.color }}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="font-medium tracking-tight text-slate-700">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl font-bold font-sans text-[14px] bg-[#FAFAFA] border border-gray-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                >
                  Get Started with {sol.title.split(' ')[0]} Solution
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security & Reliability Features */}
      <section className="py-20 w-full bg-[#f8fbfd] border-t border-b border-gray-150/60 relative">
        <div className="w-full max-w-[1240px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto mb-16"
          >
            <h2 className="text-[#1B4A61] font-semibold font-sans text-3xl tracking-tight mb-4">
              Enterprise-Grade Protection
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-500 leading-relaxed">
              Every solution runs on our high-performance secure ledger infrastructure.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white border border-gray-150 p-7 rounded-[22px] shadow-sm">
              <ShieldCheck className="w-10 h-10 text-[#0088FF] mb-5" />
              <h4 className="font-sans font-bold text-lg text-slate-800 mb-2">Bank-Grade Encryption</h4>
              <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                Your statements, logs, and billing directories are secure under strict AES-256 protocols.
              </p>
            </div>
            <div className="bg-white border border-gray-150 p-7 rounded-[22px] shadow-sm">
              <Database className="w-10 h-10 text-[#1DB46B] mb-5" />
              <h4 className="font-sans font-bold text-lg text-slate-800 mb-2">Automated Cloud Backup</h4>
              <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                Never lose your customer balances. Real-time updates automatically backed up to redundancy servers.
              </p>
            </div>
            <div className="bg-white border border-gray-150 p-7 rounded-[22px] shadow-sm">
              <Zap className="w-10 h-10 text-amber-500 mb-5" />
              <h4 className="font-sans font-bold text-lg text-slate-800 mb-2">Instant Sync</h4>
              <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                Keep the ledger reconciled on your mobile, office desktop, and field agent devices in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}

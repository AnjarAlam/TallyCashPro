'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Award, Handshake, Mail, MessageSquare, Send, Check } from 'lucide-react';
import Header from '@/section/header';
import NewFooter from '@/section/newfooter';

interface PartnerProgram {
  title: string;
  badge: string;
  commission: string;
  description: string;
  features: string[];
  color: string;
}

const programs: PartnerProgram[] = [
  {
    title: 'Affiliates & Creators',
    badge: 'Referral Program',
    commission: 'Up to 25% Lifetime Recurring',
    description: 'Promote TallyCash Pro on your content channels, blogs, or social media pages. Earn commissions for every subscriber you refer.',
    color: '#0088FF',
    features: [
      'Dedicated dashboard tracking referrals & rewards',
      'Ready-made banners, guides, and marketing assets',
      'Pills tracking cookie windows up to 60 days',
      'Monthly direct bank transfers payouts',
    ],
  },
  {
    title: 'Consultants & Accountants',
    badge: 'Reseller Program',
    commission: 'Up to 35% Bulk Discount',
    description: 'Provide TallyCash Pro accounts to your client portfolio directly. Set up books, handle initial configurations, and manage their ledgers.',
    color: '#1DB46B',
    features: [
      'Discounted bulk licenses package options',
      'Partner portal to manage multiple client workspaces',
      'Priority client support escalation tickets',
      'Exclusive certified partner training badge',
    ],
  },
];

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    program: 'Affiliate',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submit delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

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

      {/* Partner Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 border-b border-gray-150/60 bg-[#FAFAFA]">
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
            <Handshake className="w-4 h-4 text-[#1DB46B]" />
            <span className="font-sans font-semibold text-[13px] tracking-tight text-slate-600">
              Partner With TallyCash Pro
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#1B4A61] font-semibold font-sans text-4xl sm:text-5xl lg:text-[62px] leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6"
          >
            Grow your business by<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#109DE5] via-[#0088FF] to-[#1DB46B]">
              helping clients manage theirs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-sans font-medium text-base sm:text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto"
          >
            Earn premium rewards, get exclusive resources, and collaborate with us to bring smart cashflow tools to businesses worldwide.
          </motion.p>
        </div>
      </section>

      {/* Program Categories Section */}
      <section className="py-24 w-full bg-white relative">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {programs.map((prog) => (
              <motion.div
                key={prog.title}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-white border border-gray-150 rounded-[28px] p-8 md:p-10 flex flex-col justify-between transition-shadow duration-300 hover:shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        {prog.badge}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold font-sans text-[#1B4A61]">
                        {prog.title}
                      </h3>
                    </div>
                    <span 
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0"
                      style={{ backgroundColor: `${prog.color}12`, color: prog.color }}
                    >
                      {prog.commission}
                    </span>
                  </div>

                  <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-slate-500 mb-8">
                    {prog.description}
                  </p>

                  <hr className="border-t border-slate-100 mb-8" />

                  <ul className="space-y-4 mb-8">
                    {prog.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] leading-normal text-slate-600">
                        <div 
                          className="p-0.5 rounded-full mt-0.5 shrink-0"
                          style={{ backgroundColor: `${prog.color}12`, color: prog.color }}
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
              </motion.div>
            ))}
          </motion.div>

          {/* Form container */}
          <div id="join-form" className="w-full max-w-[650px] mx-auto bg-[#f8fbfd] border border-gray-200/80 rounded-[32px] p-8 sm:p-12 relative">
            <div className="text-center mb-8">
              <h2 className="text-[#1B4A61] font-semibold font-sans text-2xl tracking-tight mb-2">
                Join our partner network
              </h2>
              <p className="font-sans text-sm text-slate-500">
                Fill in the details below, and our partnership manager will reach out within 24 hours.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!submitSuccess ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-sans text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0088FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-sans text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0088FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Corp"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-sans text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0088FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Program
                    </label>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-sans text-sm text-slate-800 focus:outline-none focus:border-[#0088FF]"
                    >
                      <option value="Affiliate">Affiliate & Creator Program</option>
                      <option value="Reseller">Reseller & Consultant Program</option>
                      <option value="Integration">Developer Integration Partner</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Briefly describe your channel or business model
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi, I manage an auditing consultancy..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-sans text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0088FF] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold font-sans text-[14.5px] bg-[#1B4A61] hover:bg-[#153a4d] text-white flex items-center justify-center gap-2 border border-transparent transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Submit Partnership Application'}
                    <Send className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-[#1B4A61] font-semibold font-sans text-xl mb-2">
                    Application Sent!
                  </h3>
                  <p className="font-sans text-sm text-slate-500 max-w-sm mx-auto mb-6">
                    Thank you for applying to partner with TallyCash Pro, {formData.name}. Our partner manager will review your submission and email you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({ name: '', email: '', company: '', message: '', program: 'Affiliate' });
                    }}
                    className="px-6 py-2.5 rounded-full border border-gray-200 font-sans font-bold text-sm text-[#1B4A61] hover:bg-slate-50 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}

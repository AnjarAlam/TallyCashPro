'use client';

import { motion, type Variants } from 'framer-motion';
import { Sparkles, ArrowRight, Play, BookOpen, Terminal, Newspaper, Search, ArrowUpRight } from 'lucide-react';
import Header from '@/section/header';
import NewFooter from '@/section/newfooter';

interface ResourceHub {
  title: string;
  count: string;
  icon: React.ReactNode;
  description: string;
  href: string;
  color: string;
}

const hubs: ResourceHub[] = [
  {
    title: 'Help Guides & Manuals',
    count: '24 articles',
    icon: <BookOpen className="w-6 h-6 text-[#0088FF]" />,
    description: 'Learn how to create books, import bulk transactions, add team members, and download detailed reports.',
    href: '#',
    color: '#0088FF',
  },
  {
    title: 'Video Walkthroughs',
    count: '8 tutorials',
    icon: <Play className="w-6 h-6 text-[#1DB46B]" />,
    description: 'Watch step-by-step videos on ledger configurations, mobile-to-desktop sync, and role permissions setup.',
    href: '#',
    color: '#1DB46B',
  },
  {
    title: 'Developer REST API',
    count: 'v1.4 docs',
    icon: <Terminal className="w-6 h-6 text-purple-500" />,
    description: 'Integrate TallyCash Pro directly into your custom ERP systems, POS systems, or accounting pipelines.',
    href: '#',
    color: '#8B5CF6',
  },
];

interface RecentPost {
  title: string;
  category: string;
  date: string;
  readTime: string;
  description: string;
  href: string;
}

const recentPosts: RecentPost[] = [
  {
    title: '5 Best Bookkeeping Practices for Growing Retail Stores',
    category: 'Finance Tips',
    date: 'July 05, 2026',
    readTime: '5 min read',
    description: 'Discover how daily cash tallies, customer ledger tracking, and role-based staff accesses can streamline retail operations.',
    href: '#',
  },
  {
    title: 'Reconciling Cash Book Inflows with Excel Reports',
    category: 'Guides',
    date: 'June 28, 2026',
    readTime: '3 min read',
    description: 'A comprehensive guide on exporting transaction logs, reading categories sheets, and cross-checking cash registers.',
    href: '#',
  },
  {
    title: 'Setting up Webhooks for Real-Time Cash Registers Sync',
    category: 'Developers',
    date: 'June 14, 2026',
    readTime: '8 min read',
    description: 'Learn how to leverage our developer APIs to fire instant notifications when transactions are approved by staff.',
    href: '#',
  },
];

export default function ResourcesPage() {
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

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow">
              <Header />
            </header>

      {/* Resources Hero */}
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
            <Newspaper className="w-4 h-4 text-[#0088FF]" />
            <span className="font-sans font-semibold text-[13px] tracking-tight text-slate-600">
              Knowledge Hub & Resources
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#1B4A61] font-semibold font-sans text-4xl sm:text-5xl lg:text-[62px] leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6"
          >
            Everything you need to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#109DE5] via-[#0088FF] to-[#1DB46B]">
              master your business cash flow
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-sans font-medium text-base sm:text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto mb-10"
          >
            Access guides, video walkthroughs, and developer documentations to leverage our bookkeeping platform.
          </motion.p>

        </div>
      </section>

      {/* Main Categories Section */}
      <section className="py-24 w-full bg-white relative">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full mb-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {hubs.map((hub) => (
              <motion.a
                key={hub.title}
                href={hub.href}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="bg-[#f8fbfd] border border-gray-200/60 rounded-[24px] p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-gray-300"
              >
                <div>
                  <div className="flex justify-between items-center gap-4 mb-6">
                    <div 
                      className="p-3 rounded-xl shrink-0 bg-white shadow-sm border border-gray-100"
                    >
                      {hub.icon}
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase"
                      style={{ backgroundColor: `${hub.color}12`, color: hub.color }}
                    >
                      {hub.count}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-sans text-[#1B4A61] mb-2">
                    {hub.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {hub.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900">
                  Explore Hub
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Recent articles / publications */}
          <div className="w-full max-w-[900px] mx-auto">
            <h2 className="text-[#1B4A61] font-semibold font-sans text-2xl tracking-tight mb-8 text-left">
              Recent articles & guides
            </h2>

            <div className="flex flex-col gap-6">
              {recentPosts.map((post, idx) => (
                <motion.a
                  key={idx}
                  href={post.href}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white border border-gray-150 rounded-[20px] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="text-left max-w-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] font-bold text-[#0088FF] uppercase tracking-wider bg-[#0088FF]/10 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {post.date}
                      </span>
                      <span className="text-slate-200">•</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-[16px] sm:text-[18px] font-bold font-sans text-slate-800 mb-2 hover:text-slate-900 transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] border border-gray-200/50 flex items-center justify-center shrink-0 hover:bg-slate-50">
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <NewFooter />
    </div>
  );
}

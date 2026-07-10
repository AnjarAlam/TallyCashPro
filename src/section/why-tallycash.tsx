'use client'

import { Wallet,  Users, ShieldCheck, TrendingUp, Smartphone, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Wallet,
    title: 'Track Income & Expenses',
    description: 'Tally Cash Flow updates your books instantly with every cash or UPI transaction.',
  },
{
  icon: Building2, 
  title: 'Create Multiple Businesses',
  description: 'Easily manage separate cash books for different businesses from one single dashboard.',
},

  {
    icon: Smartphone,
    title: '100% Mobile Friendly',
    description: 'Manage, record, and view cash flow on the go—right from your smartphone.',
  },
  {
    icon: Users,
    title: 'Add Staff and manage Business',
    description: 'Give access to your staff with proper roles, control who adds and views entries.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Cloud-Based',
    description: 'All your financial data is encrypted and backed up in the cloud for safety.',
  },
  {
    icon: TrendingUp,
    title: 'Get Instant Cash Reports',
    description: 'Understand cash inflow/outflow trends with easy, auto-generated reports.',
  },
]

export default function WhyTallyCashFlow() {
  return (
    <section className="bg-muted from-white to-slate-100 py-24 px-6 md:px-10 ">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          Why Tally Cash Flow?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-2xl mx-auto text-lg tracking-tight"
        >
          A better way to manage business money. Tally Cash Flow helps you stay on top of your
          cashbook without lifting a pen—fast, reliable, and fully digital.
        </motion.p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Twitter, Youtube, Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const CONTACT_EMAIL = 'info@gtechsoftsolution.com';
const SUPPORT_EMAIL = 'support@gtechsoftsolution.com';

type FooterLink = {
  label: string;
  href: string;
  popup?: 'contact' | 'support';
};

type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};

const socials = [
  { icon: Twitter, href: "#" },
  { icon: Youtube, href: "https://www.youtube.com/@tallycashpro" },
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61588094668431" },
  { icon: Instagram, href: "https://www.instagram.com/tallycashpro" },
  { icon: Linkedin, href: "#" }
];

const linkGroups: FooterLinkGroup[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      // { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/#security" },
      // { label: "Updates", href: "#" }
    ]
  },
  {
    title: "Solutions",
    links: [
      { label: "Retail Stores", href: "/#faq" },
      { label: "Wholesalers", href: "/#faq" },
      { label: "Distributors", href: "/#business-management" },
      { label: "Small Businesses", href: "/#business-management" }
    ]
  },
  {
    title: "Company",
    links: [
      // { label: "About Us", href: "#" },
      { label: "Contact", href: "#", popup: "contact" },
      // { label: "Blog", href: "#" },
      { label: "Support", href: "#", popup: "support" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      // { label: "Refund Policy", href: "#" }
    ]
  }
];

export default function NewFooter() {
  const pathname = usePathname();
  const [openPopup, setOpenPopup] = useState<'contact' | 'support' | null>(null);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSectionLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('/#')) return;

    const sectionId = href.slice(2);
    if (pathname === '/') {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: FooterLink
  ) => {
    if (link.popup) {
      e.preventDefault();
      setOpenPopup(link.popup);
      return;
    }
    handleSectionLink(e, link.href);
  };

  const popupConfig = {
    contact: {
      title: 'Contact Us',
      description: 'You can contact us at:',
      email: CONTACT_EMAIL,
    },
    support: {
      title: 'Support',
      description: 'For help and support, reach us at:',
      email: SUPPORT_EMAIL,
    },
  };

  const activePopup = openPopup ? popupConfig[openPopup] : null;

  return (
    <footer className="w-full bg-white pt-16 md:pt-24 border-t border-gray-100 flex flex-col items-center">

      {/* Upper Links Block (Frame 53) */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-[109px] w-full max-w-[1168px] mx-auto px-6 lg:px-0">

        {/* Left Brand Content Column (Frame 47) */}
        <div className="flex flex-col justify-between items-start gap-[18px] w-full lg:w-[307px] min-h-[201px]">
          <div className="flex flex-col items-start gap-[18px] w-full">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img
                src="/logo1.png"
                alt="TallyCashPro Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b2265] flex items-center">
                TallyCash<span className="text-[#139d8c]">Pro</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="font-sans font-normal text-[16px] leading-[24px] tracking-[-0.32px] text-[#888888] text-left">
              Simplify daily operations with smart tools for inventory, sales, payments, and business records.
            </p>
          </div>

          {/* Social Icons (Frame 55) */}
          <div className="flex items-center gap-[5.73px] mt-2">
            {socials.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className="w-[26.59px] h-[26.59px] flex items-center justify-center border border-black/5 rounded-[8px] bg-white hover:bg-slate-50 transition-colors"
                >
                  <Icon className="w-[13px] h-[13px] text-[#888888]" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Links Grid (Frame 52) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 lg:w-[752px] w-full text-left">
          {linkGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col items-start min-h-[167px]">
              {/* Category Title */}
              <span className="font-sans font-semibold text-[16px] leading-[24px] tracking-[-0.32px] text-[#1C1C1C] mb-[31px]">
                {group.title}
              </span>

              {/* Links List */}
              <ul className="flex flex-col gap-[12px]">
                {group.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link)}
                      className="font-sans font-normal text-[14px] leading-[28px] tracking-[-0.32px] text-[#1C1C1C]/80 hover:text-[#0ea5e9] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      <Dialog open={openPopup !== null} onOpenChange={(open) => !open && setOpenPopup(null)}>
        <DialogContent className="sm:max-w-md">
          {activePopup && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#1B4A61] font-semibold text-xl">
                  {activePopup.title}
                </DialogTitle>
                <DialogDescription className="text-[#888888] text-base pt-1">
                  {activePopup.description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 mt-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0ea5e9]/10">
                  <Mail className="h-5 w-5 text-[#0ea5e9]" />
                </div>
                <a
                  href={`mailto:${activePopup.email}`}
                  className="text-[#1B4A61] font-semibold text-base hover:text-[#0ea5e9] transition-colors break-all"
                >
                  {activePopup.email}
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Union Background Outline Banner (Union) */}
      <div className="w-full relative select-none overflow-hidden mt-16 py-8 sm:py-12 border-t border-gray-100/60 flex items-center justify-center bg-white">
        <div 
          className="text-center font-sans font-black text-[36px] sm:text-[54px] md:text-[80px] lg:text-[100px] xl:text-[110px] leading-[105%] tracking-[-0.03em] [-webkit-text-stroke:1px_#E2E8F0] select-none"
          style={{
            background: 'linear-gradient(180deg, #F4F4F4 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Less paperwork. More<br />
          business growth.
        </div>
      </div>

      {/* Copyright Footer Label */}
      <div className="w-full text-center py-6 border-t border-gray-100/60 bg-white">
        <p className="font-sans font-normal text-[13px] leading-[24px] tracking-[-0.32px] text-[#888888]">
          © {new Date().getFullYear()} TallyCash Pro. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

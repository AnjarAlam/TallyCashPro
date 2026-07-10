import Link from 'next/link';
import Header from '@/section/header';
import NewFooter from '@/section/newfooter';

interface LegalPageLayoutProps {
  title: string;
  effectiveDate: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, effectiveDate, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14 md:py-16 text-left">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#0ea5e9] hover:text-[#0284c7] transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        <h1 className="text-3xl sm:text-4xl font-semibold font-stix text-[#1B4A61] tracking-[-1px] mb-3">
          {title}
        </h1>
        <p className="text-sm text-[#888888] mb-2">
          <strong className="text-[#1B4A61]">Effective Date:</strong> {effectiveDate}
        </p>
        <p className="text-sm text-[#888888] mb-2">
          <strong className="text-[#1B4A61]">App Name:</strong> TallyCash Pro
        </p>
        <p className="text-sm text-[#888888] mb-10">
          <strong className="text-[#1B4A61]">Developer:</strong> Gtech Soft Solutions
        </p>

        <div className="space-y-8 text-[#1B4A61]/90 font-sans text-[15px] sm:text-base leading-relaxed">
          {children}
        </div>
      </main>

      <NewFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-semibold text-[#1B4A61] mb-3">{title}</h2>
      {children}
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-6 space-y-2 mt-2">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export const LEGAL_CONTACT_EMAIL = 'info@gtechsoftsolution.com';

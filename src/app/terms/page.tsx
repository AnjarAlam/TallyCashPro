import type { Metadata } from 'next';
import Link from 'next/link';
import {
  LegalPageLayout,
  LegalSection,
  LegalList,
  LEGAL_CONTACT_EMAIL,
} from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Terms & Conditions | TallyCash Pro',
  description:
    'Read the Terms and Conditions for using TallyCash Pro finance management platform.',
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" effectiveDate="June 20, 2026">
      <LegalSection title="1. Acceptance of Terms">
        <p>
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of
          TallyCash Pro, a finance management application provided by Gtech Soft Solutions
          .
        </p>
        <p className="mt-3">
          By creating an account, downloading the app, or using TallyCash Pro on mobile or web,
          you agree to be bound by these Terms. If you do not agree, please do not use our
          services.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of Service">
        <p>
          TallyCash Pro is a platform designed to help users manage personal and business
          finances. Our services may include, but are not limited to:
        </p>
        <LegalList
          items={[
            'Income and expense tracking',
            'Multiple cashbooks and custom categories',
            'Customer, contact, and credit (udhaar) ledger management',
            'Inventory tracking for businesses',
            'PDF and Excel report generation',
            'Team collaboration with role-based access',
            'Real-time sync across mobile and web devices',
            'Invoice and receipt storage',
            'Cloud backup and data security features',
          ]}
        />
        <p className="mt-3">
          We may add, modify, or discontinue features at any time to improve the platform.
        </p>
      </LegalSection>

      <LegalSection title="3. Eligibility">
        <p>
          You must be at least 13 years of age to use TallyCash Pro. If you are using the
          service on behalf of a business or organization, you represent that you have the
          authority to bind that entity to these Terms.
        </p>
      </LegalSection>

      <LegalSection title="4. Account Registration & Security">
        <p>When you create an account, you agree to:</p>
        <LegalList
          items={[
            'Provide accurate, current, and complete registration information',
            'Keep your login credentials confidential and secure',
            'Notify us immediately of any unauthorized access to your account',
            'Accept responsibility for all activity that occurs under your account',
          ]}
        />
        <p className="mt-3">
          We reserve the right to suspend or terminate accounts that contain false information
          or violate these Terms.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable Use">
        <p>You agree not to use TallyCash Pro to:</p>
        <LegalList
          items={[
            'Violate any applicable law, regulation, or third-party rights',
            'Upload false, misleading, or fraudulent financial records',
            'Attempt to gain unauthorized access to other users\' accounts or our systems',
            'Interfere with or disrupt the platform, servers, or networks',
            'Use automated tools to scrape, copy, or abuse the service without permission',
            'Transmit malware, spam, or harmful code',
            'Use the service for any unlawful or fraudulent financial activity',
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Your Data & Content">
        <p>
          You retain ownership of the financial records, transactions, and other content you
          enter into TallyCash Pro (&quot;User Content&quot;). By using our services, you grant
          us a limited license to store, process, and display your User Content solely to
          provide and improve the platform.
        </p>
        <p className="mt-3">
          You are solely responsible for the accuracy of the data you enter. TallyCash Pro is a
          record-keeping and management tool — we do not provide accounting, tax, or legal
          advice, and our reports should not be relied upon as a substitute for professional
          financial guidance.
        </p>
      </LegalSection>

      <LegalSection title="7. Team Access & Permissions">
        <p>
          If you invite family members, staff, or other users to your account, you are
          responsible for assigning appropriate roles and permissions. You agree that anyone
          you invite may access data according to the role you assign. We are not liable for
          actions taken by users you authorize within your account.
        </p>
      </LegalSection>

      <LegalSection title="8. Subscription, Fees & Payments">
        <p>
          Certain features of TallyCash Pro may be offered free of charge, while others may
          require a paid subscription or one-time purchase. Pricing, billing cycles, and
          included features will be displayed before you complete a purchase.
        </p>
        <p className="mt-3">
          All fees are non-refundable unless otherwise stated in a separate refund policy or
          required by applicable law. We reserve the right to change pricing with reasonable
          notice to existing subscribers.
        </p>
      </LegalSection>

      <LegalSection title="9. Intellectual Property">
        <p>
          TallyCash Pro, including its software, design, logos, trademarks, and documentation,
          is owned by Gtech Soft Solutions and protected by intellectual property laws. You may
          not copy, modify, distribute, sell, or reverse engineer any part of the platform
          without our prior written consent.
        </p>
      </LegalSection>

      <LegalSection title="10. Privacy">
        <p>
          Your use of TallyCash Pro is also governed by our{' '}
          <Link href="/privacy" className="text-[#0ea5e9] hover:underline">
            Privacy Policy
          </Link>
          , which explains how we collect, use, and protect your information. By using the
          service, you consent to our data practices as described in that policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Service Availability">
        <p>
          We strive to keep TallyCash Pro available at all times, but we do not guarantee
          uninterrupted or error-free operation. The service may be temporarily unavailable due
          to maintenance, updates, network issues, or circumstances beyond our control. We are
          not liable for any loss resulting from downtime or data sync delays.
        </p>
      </LegalSection>

      <LegalSection title="12. Disclaimer of Warranties">
        <p>
          TallyCash Pro is provided on an &quot;as is&quot; and &quot;as available&quot; basis
          without warranties of any kind, whether express or implied, including but not limited
          to warranties of merchantability, fitness for a particular purpose, or
          non-infringement. We do not warrant that the service will meet your specific
          requirements or that calculations and reports will be error-free.
        </p>
      </LegalSection>

      <LegalSection title="13. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Gtech Soft Solutions and its officers,
          employees, and partners shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including loss of profits, data, or business
          opportunities, arising from your use of TallyCash Pro.
        </p>
        <p className="mt-3">
          Our total liability for any claim related to the service shall not exceed the amount
          you paid us in the twelve (12) months preceding the claim, or one hundred US dollars
          (USD $100), whichever is greater.
        </p>
      </LegalSection>

      <LegalSection title="14. Indemnification">
        <p>
          You agree to indemnify and hold harmless Gtech Soft Solutions from any claims,
          damages, losses, or expenses (including reasonable legal fees) arising from your use
          of TallyCash Pro, your User Content, your violation of these Terms, or your
          violation of any rights of a third party.
        </p>
      </LegalSection>

      <LegalSection title="15. Termination">
        <p>
          You may stop using TallyCash Pro and delete your account at any time. We may suspend
          or terminate your access if you violate these Terms, engage in fraudulent activity,
          or if required by law. Upon termination, your right to use the service ceases
          immediately. Provisions that by their nature should survive termination will remain
          in effect.
        </p>
      </LegalSection>

      <LegalSection title="16. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India,
          without regard to conflict of law principles. Any disputes arising under these Terms
          shall be subject to the exclusive jurisdiction of the courts located in India, unless
          otherwise required by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="17. Changes to These Terms">
        <p>
          We may update these Terms from time to time. When we make material changes, we will
          update the Effective Date at the top of this page. Your continued use of TallyCash
          Pro after changes are posted constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="18. Contact Us">
        <p>
          If you have questions about these Terms &amp; Conditions, please contact us:
        </p>
        <LegalList
          items={[
            `Email: ${LEGAL_CONTACT_EMAIL}`,
            'Developer: Gtech Soft Solutions',
            'Product: TallyCash Pro',
          ]}
        />
      </LegalSection>
    </LegalPageLayout>
  );
}

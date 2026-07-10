import type { Metadata } from 'next';
import {
  LegalPageLayout,
  LegalSection,
  LegalList,
  LEGAL_CONTACT_EMAIL,
} from '@/components/legal-page-layout';

export const metadata: Metadata = {
  title: 'Privacy Policy | TallyCash Pro',
  description:
    'Learn how TallyCash Pro collects, uses, and protects your personal and financial data.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" effectiveDate="June 20, 2026">
      <LegalSection title="1. Introduction">
        <p>
          TallyCash Pro  is a finance management
          platform developed by Gtech Soft Solutions. Our application helps individuals,
          families, and small businesses track income and expenses, manage multiple cashbooks,
          maintain customer and contact ledgers, monitor inventory, generate reports, and
          collaborate with team members.
        </p>
        <p className="mt-3">
          This Privacy Policy explains how we collect, use, store, and protect your information
          when you use TallyCash Pro on mobile or web. By creating an account or using our
          services, you agree to the practices described in this policy.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p className="font-medium text-[#1B4A61] mb-2">a. Account & Profile Information</p>
        <p>When you register or update your profile, we may collect:</p>
        <LegalList
          items={[
            'Full name',
            'Email address',
            'Phone number',
            'Business or account details you choose to provide',
          ]}
        />

        <p className="font-medium text-[#1B4A61] mt-6 mb-2">b. Financial & Business Data</p>
        <p>
          To provide our core services, you may enter or upload data such as transactions,
          cashbook entries, categories, payment modes, customer and vendor records, credit
          (udhaar) ledgers, inventory items, invoices, receipts, and reports. This data is
          stored to power features you use within the app.
        </p>

        <p className="font-medium text-[#1B4A61] mt-6 mb-2">c. Team & Access Data</p>
        <p>
          If you invite family members or staff, we collect information needed to manage team
          access, including names, email addresses, and assigned roles (such as Viewer, Editor,
          Partner, or Admin).
        </p>

        <p className="font-medium text-[#1B4A61] mt-6 mb-2">d. Device & Usage Information</p>
        <p>We may automatically collect limited technical data, including:</p>
        <LegalList
          items={[
            'Device type, operating system, and browser version',
            'IP address and general location (city/region level)',
            'App usage logs, crash reports, and performance data',
            'Login sessions and security-related activity',
          ]}
        />

        <p className="font-medium text-[#1B4A61] mt-6 mb-2">e. Camera & File Access</p>
        <p>
          With your permission, TallyCash Pro may access your device camera or file storage to
          scan or upload invoices, receipts, bills, and other documents for record-keeping.
          We do not access your camera or files unless you initiate that action.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <LegalList
          items={[
            'Create, authenticate, and manage your TallyCash Pro account',
            'Provide income tracking, expense management, multiple books, and reporting features',
            'Enable team collaboration and role-based access for businesses and families',
            'Sync your data across mobile and web in real time',
            'Generate PDF and Excel reports based on your records',
            'Send important service updates, security alerts, and support responses',
            'Improve app performance, fix bugs, and develop new features',
            'Comply with legal obligations and prevent fraud or misuse',
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Data Sharing & Disclosure">
        <p>
          We do not sell or rent your personal or financial data to third parties. We may share
          information only in the following circumstances:
        </p>
        <LegalList
          items={[
            'With team members you authorize within your account, based on their assigned role',
            'With trusted service providers who help us operate the platform (e.g., cloud hosting, analytics, email delivery), under strict confidentiality obligations',
            'When required by law, court order, or government request',
            'To protect the rights, safety, and security of TallyCash Pro, our users, or the public',
            'In connection with a merger, acquisition, or sale of assets, with notice where required by law',
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Data Security">
        <p>
          We take the security of your financial records seriously. TallyCash Pro uses
          industry-standard safeguards, including:
        </p>
        <LegalList
          items={[
            'Encrypted data transmission (SSL/TLS)',
            'Secure cloud storage with access controls',
            'Role-based permissions for team and staff access',
            'Regular backups to help prevent data loss',
            'Restricted internal access to user data',
          ]}
        />
        <p className="mt-3">
          While we work hard to protect your information, no method of electronic storage or
          transmission is completely secure. You are responsible for keeping your login
          credentials confidential.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We retain your account and financial data for as long as your account is active or
          as needed to provide our services. If you delete your account or request data
          deletion, we will remove or anonymize your personal data within a reasonable period,
          except where retention is required by law or for legitimate business purposes such as
          resolving disputes or enforcing our agreements.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights & Choices">
        <p>Depending on your location, you may have the right to:</p>
        <LegalList
          items={[
            'Access and review the personal data we hold about you',
            'Update or correct inaccurate account information',
            'Export your financial records and reports',
            'Request deletion of your account and associated data',
            'Withdraw consent for optional data processing where applicable',
            'Opt out of non-essential marketing communications',
          ]}
        />
        <p className="mt-3">
          To exercise these rights, contact us at{' '}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-[#0ea5e9] hover:underline">
            {LEGAL_CONTACT_EMAIL}
          </a>
          . We will respond within a reasonable timeframe.
        </p>
      </LegalSection>

      <LegalSection title="8. Children's Privacy">
        <p>
          TallyCash Pro is not intended for children under the age of 13. We do not knowingly
          collect personal information from children. If you believe a child has provided us
          with personal data, please contact us and we will take steps to delete it.
        </p>
      </LegalSection>

      <LegalSection title="9. International Users">
        <p>
          TallyCash Pro may be accessed from different countries. By using our services, you
          understand that your information may be processed and stored on servers located
          outside your country of residence, where data protection laws may differ.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our
          practices, features, or legal requirements. When we make material changes, we will
          update the Effective Date at the top of this page. Continued use of TallyCash Pro
          after changes are posted constitutes acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or your
          data, please contact us:
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

export interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'What is TallyCash Pro?',
    answer: 'TallyCash Pro is a comprehensive business accounting and cash flow management app. It helps you track income, expenses, manage multiple businesses, create books, and collaborate with team members.',
  },
  {
    category: 'Getting Started',
    question: 'How do I get started?',
    answer: '1. Create an account or sign in\n2. Create your first business\n3. Add a book to track transactions\n4. Start recording your income and expenses\n5. Invite team members if needed',
  },
  
  // Business Management
  {
    category: 'Business Management',
    question: 'How do I create a new business?',
    answer: '1. Go to the home screen\n2. Tap the business switcher at the top\n3. Select "Add New Business"\n4. Enter business name, industry, and other details\n5. Tap "Create Business"',
  },
  {
    category: 'Business Management',
    question: 'Can I manage multiple businesses?',
    answer: 'Yes! You can create and manage unlimited businesses. Switch between them using the business switcher at the top of the home screen.',
  },
  {
    category: 'Business Management',
    question: 'How do I edit or delete a business?',
    answer: 'Go to the business list, tap on a business, then access Settings. From there you can edit business details or delete the business (requires owner permission).',
  },
  
  // Book Management
  {
    category: 'Books',
    question: 'What is a Book?',
    answer: 'A Book is like a digital ledger that tracks all your cash inflows and outflows. You can create separate books for different purposes like "Main Cash", "Petty Cash", "Bank Account", etc.',
  },
  {
    category: 'Books',
    question: 'How do I create a new Book?',
    answer: '1. Select your business\n2. Tap the "+" button or "Add Book"\n3. Enter book name and description\n4. Select currency and book type\n5. Tap "Save" to create',
  },
  {
    category: 'Books',
    question: 'Can I have multiple Books in one business?',
    answer: 'Yes! You can create unlimited books within each business to organize different cash flows separately.',
  },
  {
    category: 'Books',
    question: 'How do I move a Book to another business?',
    answer: '1. Find the book you want to move\n2. Tap the menu (⋮) icon on the book card\n3. Select "Move to Another Business"\n4. Choose the destination business\n5. Confirm the move',
  },
  {
    category: 'Books',
    question: 'What happens when I delete a Book?',
    answer: 'Deleting a book will permanently remove it and ALL its transactions. This action cannot be undone. Make sure to export or backup important data before deletion.',
  },
  
  // Transactions
  {
    category: 'Transactions',
    question: 'How do I add a transaction?',
    answer: '1. Open a book\n2. Tap the "+" button\n3. Select transaction type (Cash In or Cash Out)\n4. Enter amount and details\n5. Choose payment mode, category, and party (optional)\n6. Add attachments if needed\n7. Tap "Save"',
  },
  {
    category: 'Transactions',
    question: 'What is the difference between Cash In and Cash Out?',
    answer: 'Cash In: Money received (income, sales, receipts)\nCash Out: Money paid (expenses, purchases, payments)\n\nCash In increases your balance, Cash Out decreases it.',
  },
  {
    category: 'Transactions',
    question: 'How do I edit or delete a transaction?',
    answer: 'Open the transaction details:\n• To Edit: Tap the menu (⋮) and select "Edit Transaction"\n• To Delete: Tap the menu (⋮) and select "Delete Transaction"\n\nNote: Editors can edit but only owners/admins can delete.',
  },
  {
    category: 'Transactions',
    question: 'How do I move a transaction to another Book?',
    answer: '1. Open the transaction details\n2. Tap the menu (⋮) icon\n3. Select "Move to Another Book"\n4. Choose the destination book\n5. Confirm the move',
  },
  {
    category: 'Transactions',
    question: 'Can I attach documents to transactions?',
    answer: 'Yes! You can attach images, PDFs, and documents to any transaction. This is useful for receipts, invoices, and proof of payment.',
  },
  {
    category: 'Transactions',
    question: 'How do I search for transactions?',
    answer: 'Use the search icon in the book screen. You can search by:\n• Party name\n• Amount\n• Category\n• Invoice number\n• Date range\n• Transaction type',
  },
  
  // Team Members
  {
    category: 'Team & Members',
    question: 'How do I add team members to my business?',
    answer: '1. Go to Business Settings\n2. Select "Team Members"\n3. Tap "Add Member"\n4. Enter their email or phone number\n5. Assign a role (Owner, Partner, Admin, Editor, Viewer)\n6. Send invitation',
  },
  {
    category: 'Team & Members',
    question: 'What are the different member roles?',
    answer: '• Owner: Full access, can delete business\n• Partner: Can add/edit books, manage team\n• Admin: Can manage transactions and delete them\n• Editor: Can create/edit transactions (cannot delete)\n• Viewer: Read-only access',
  },
  {
    category: 'Team & Members',
    question: 'How do I give members access to specific Books?',
    answer: '1. Go to the book you want to share\n2. Tap the menu (⋮) icon\n3. Select "Manage Members"\n4. Add members and assign roles for that specific book',
  },
  {
    category: 'Team & Members',
    question: 'Can I remove a team member?',
    answer: 'Yes, owners and partners can remove team members from Business Settings > Team Members. Select the member and choose "Remove from Business".',
  },
  
  // Support
  {
    category: 'Support',
    question: 'How do I contact support?',
    answer: 'For support:\n• Email: support@tallycashpro.com\n• Go to Settings > Help & Support\n• Visit our website for more resources',
  },
  {
    category: 'Support',
    question: 'Where can I suggest new features?',
    answer: 'We love hearing from users! Send feature requests through Settings > Feedback or email us at feedback@tallycashpro.com',
  },
];
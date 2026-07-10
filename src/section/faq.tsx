export default function FAQ() {
  const faqs = [
    {
      question: "Can I set budget limits for different expense categories?",
      answer:
        "Yes! You can easily set monthly budget limits for each spending category. Our app will send you notifications when you're approaching your limit and provide insights on your spending trends.",
    },
    {
      question: "How do I add my income sources to the app?",
      answer:
        "You can manually add income sources in the Income section or connect your bank accounts for automatic tracking.",
    },
    {
      question: "How does your app categorize my expenses?",
      answer:
        "Our app uses AI to automatically categorize expenses, but you can also manually adjust categories as needed.",
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">General FAQs</h2>
        <p className="text-center mb-12 max-w-2xl mx-auto">
          Can't find what you need? Contact our support team for help.
        </p>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

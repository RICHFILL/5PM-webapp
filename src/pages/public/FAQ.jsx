import { ArrowRight } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    items: [
      { q: "How do I create an account?", a: "Click the 'Get Started' button on our homepage, fill in your details, and verify your email address. The entire process takes less than 2 minutes." },
      { q: "Is there a minimum age requirement?", a: "Yes, you must be at least 18 years old to create an account and invest on our platform." },
      { q: "Do I need to complete KYC before investing?", a: "Yes, all investors must complete KYC verification before making any investments. This is a regulatory requirement to ensure platform security." },
    ],
  },
  {
    category: "Investments",
    items: [
      { q: "What is the minimum investment amount?", a: "Minimum investments start from ₦50,000 for Wealth Plans, ₦100,000 for the Nexus Income Vault, and ₦500,000 for Fractional Real Estate." },
      { q: "How are my returns calculated?", a: "Returns are calculated based on the specific terms of each investment product. The expected ROI is clearly stated before you invest." },
      { q: "Can I withdraw my investment early?", a: "Early withdrawal terms depend on the specific investment product. Some products allow early withdrawal with penalties, while others require holding until maturity." },
    ],
  },
  {
    category: "Payments & Withdrawals",
    items: [
      { q: "How do I fund my wallet?", a: "You can fund your wallet via bank transfer to our designated account. Instructions are provided on the wallet page after login." },
      { q: "How long do withdrawals take?", a: "Withdrawal requests are processed within 1-3 business days after approval. Processing times may vary based on verification requirements." },
      { q: "Are there any fees?", a: "We charge minimal fees for early withdrawals and certain transaction types. All fees are clearly disclosed before you confirm any transaction." },
    ],
  },
  {
    category: "Security",
    items: [
      { q: "Is my investment secure?", a: "Yes. All investments are asset-backed, and we employ industry-standard encryption, secure authentication, and regular security audits." },
      { q: "How is my personal data protected?", a: "We use advanced encryption protocols and follow data protection regulations to safeguard your personal information." },
    ],
  },
];

function FAQ() {
  return (
    <div>
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Find answers to common questions about our platform, investments, and services.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {faqs.map((group) => (
            <div key={group.category}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{group.category}</h2>
              <div className="space-y-4">
                {group.items.map((faq) => (
                  <details key={faq.q} className="group bg-gray-50 rounded-xl p-5 open:ring-1 open:ring-brand-200 transition-all">
                    <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900">
                      {faq.q}
                      <ArrowRight size={16} className="group-open:rotate-90 transition-transform shrink-0" />
                    </summary>
                    <p className="mt-3 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FAQ;

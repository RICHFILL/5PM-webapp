import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const faqs = [
  {
    category: "Getting Started",
    items: [
      { q: "How do I create an account?", a: "Click the 'Get Started' button on our homepage, fill in your details, and verify your email address. The entire process takes less than 2 minutes." },
      { q: "Is there a minimum age requirement?", a: "Yes, you must be at least 18 years old to create an account and invest on our platform." },
      { q: "Do I need to complete KYC before investing?", a: "Yes, all investors must complete KYC verification before making any investments. This is a regulatory requirement to ensure platform security." },
      { q: "Can I invest from outside Nigeria?", a: "Absolutely. 5PM Nexus Invest is built for the diaspora. You can fund your wallet in USD, GBP, or EUR, and manage your entire portfolio remotely." },
    ],
  },
  {
    category: "Investments",
    items: [
      { q: "What is the minimum investment amount?", a: "All investment products start from ₦10,000,000" },
      { q: "How are my returns calculated?", a: "Returns are calculated based on the specific terms of each investment product. The expected ROI is clearly stated before you invest." },
      { q: "Can I withdraw my investment early?", a: "Early withdrawal terms depend on the specific investment product. Some products allow early withdrawal with penalties, while others require holding until maturity." },
      { q: "What types of investments are available?", a: "We offer fractional real estate, fixed-income vaults, and structured wealth plans — all asset-backed and professionally managed." },
    ],
  },
  {
    category: "Payments & Withdrawals",
    items: [
      { q: "How do I fund my wallet?", a: "You can fund your wallet via bank transfer to our designated account. Instructions are provided on the wallet page after login." },
      { q: "How long do withdrawals take?", a: "Withdrawal requests are processed within 1-3 business days after approval. Processing times may vary based on verification requirements." },
      { q: "Are there any fees?", a: "We charge minimal fees for early withdrawals and certain transaction types. All fees are clearly disclosed before you confirm any transaction." },
      { q: "Can I reinvest my returns?", a: "Yes. Returns are paid directly into your wallet, and you can reinvest them immediately into any available product with no additional fees." },
    ],
  },
  {
    category: "Security & Compliance",
    items: [
      { q: "Is my investment secure?", a: "Yes. All investments are asset-backed, and we employ industry-standard encryption, secure authentication, and regular security audits." },
      { q: "How is my personal data protected?", a: "We use advanced encryption protocols and follow data protection regulations to safeguard your personal information." },
      { q: "Is 5PM Nexus Invest regulated?", a: "We operate in full compliance with Nigerian regulatory requirements and maintain transparent documentation for all investment products." },
    ],
  },
];

function FAQ() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = faqs.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">FAQ</span>
            <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Find answers to common questions about our platform, investment products, payments, and security. Can't find what you're looking for? Reach out to our support team.
            </p>
          </div>
        </div>
      </section>

      {/* ───── SEARCH ───── */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-transparent text-sm"
            />
          </div>
        </div>
      </section>

      {/* ───── FAQS ───── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {filtered.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-neon-tangerine/10 flex items-center justify-center">
                  <HelpCircle size={16} className="text-neon-tangerine" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{group.category}</h2>
              </div>
              <div className="space-y-3">
                {group.items.map((faq) => {
                  const key = `${group.category}-${faq.q}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={key}
                      className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                        isOpen
                          ? "border-neon-tangerine/40 bg-neon-tangerine/5"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => toggleItem(key)}
                    >
                      <div className="flex items-center justify-between px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                        <ChevronDown
                          size={16}
                          className={`text-neon-tangerine shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No results found for "{search}"</p>
            </div>
          )}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">Our support team is ready to help. Reach out to us and we'll get back to you within 24 hours.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={ROUTES.CONTACT}>
              <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base">
                Contact Support <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button variant="outline" className="font-bold px-8 py-4 rounded-xl text-base">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;

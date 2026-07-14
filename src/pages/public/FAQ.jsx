import { useState } from "react";
import { ChevronDown, HelpCircle, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I create an account?",
        a: "Click the 'Get Started' button on our homepage, complete the registration form, and verify your email address. Once your account is created, you can complete your profile and begin exploring available investment opportunities.",
      },
      {
        q: "Is there a minimum age requirement?",
        a: "Yes. You must be at least 18 years old to register and invest through 5PM NEXUS INVEST.",
      },
      {
        q: "Do I need to complete KYC before investing?",
        a: "Yes. Identity verification (KYC) is required before participating in any investment opportunity. This helps us comply with regulatory requirements and protect all investors.",
      },
      {
        q: "Can I invest from outside Nigeria?",
        a: "Yes. Nigerians in the diaspora and international investors can participate in eligible projects after completing the required onboarding and KYC process.",
      },
    ],
  },
  {
    category: "Investments",
    items: [
      {
        q: "How does 5PM NEXUS INVEST work?",
        a: "We identify and acquire high-potential real estate opportunities, including prime land and distressed or undervalued properties, at attractive prices. Depending on the opportunity, we perfect titles and approvals, develop infrastructure, renovate, reposition, or redevelop the asset to unlock its full market value. The property is then sold or otherwise monetised at a premium, and investors are paid from the proceeds in accordance with the terms of their investment.",
      },
      {
        q: "What is the minimum investment amount?",
        a: "The minimum investment amount depends on the specific project or investment package currently available. Details are provided before you invest.",
      },
      {
        q: "How are investor returns generated?",
        a: "Investor returns are generated from the profits realized after land acquisition, infrastructure development, and the successful sale of developed plots. Returns vary depending on the performance of each investment project.",
      },
      {
        q: "Can I withdraw my investment early?",
        a: "Early withdrawal availability depends on the terms of the specific investment opportunity. Please review the investment agreement for the applicable conditions before investing.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "How do I make an investment?",
        a: "After completing your account verification, you can choose an available project and follow the provided payment instructions to participate.",
      },
      {
        q: "When are investors paid?",
        a: "Investors are paid from the proceeds generated through the sale of developed plots. Payments are made according to the terms and timeline of the specific investment project.",
      },
      {
        q: "Can I reinvest my earnings?",
        a: "Yes. Once your investment returns have been distributed, you may choose to participate in any new investment opportunities available on the platform.",
      },
      {
        q: "Are there any investment fees?",
        a: "Any applicable administrative or transaction fees will be clearly disclosed before you confirm your investment. We believe in transparent pricing with no hidden charges.",
      },
    ],
  },
  {
    category: "Security & Compliance",
    items: [
      {
        q: "Is my investment secured?",
        a: "Every investment opportunity is backed by tangible real estate assets. We ensure proper land verification, title perfection, and legal documentation before commencing project development.",
      },
      {
        q: "How is my personal information protected?",
        a: "We use industry-standard security measures and encryption technologies to protect your personal information and maintain the confidentiality of your account.",
      },
      {
        q: "Why are investors paid before the company profits?",
        a: "Our investment model is designed so that investors receive their agreed returns from project sales before the company realizes its own profit. This aligns our success with that of our investors and reflects our commitment to transparency.",
      },
      {
        q: "Will I receive updates on my investment?",
        a: "Yes. Investors receive regular updates on land acquisition, approvals, infrastructure development, project milestones, and sales progress throughout the investment lifecycle.",
      },
    ],
  },
];

function FAQ() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filtered = faqs
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">
              FAQ
            </span>
            <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Find answers to common questions about our platform, investment
              products, payments, and security. Can't find what you're looking
              for? Reach out to our support team.
            </p>
          </div>
        </div>
      </section>

      {/* ───── SEARCH ───── */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
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
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  {group.category}
                </h2>
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
                        <span className="text-sm font-semibold text-gray-900 pr-4">
                          {faq.q}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-neon-tangerine shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {faq.a}
                          </p>
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
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
            Our support team is ready to help. Reach out to us and we'll get
            back to you within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={ROUTES.CONTACT}>
              <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base">
                Contact Support <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER}>
              <Button
                variant="outline"
                className="font-bold px-8 py-4 rounded-xl text-base"
              >
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

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, Shield, Star, ArrowRight, ChevronDown,
  Home, Wallet, CheckCircle, Globe, BarChart3, Users, ChevronRight,
} from "lucide-react";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const products = [
  {
    name: "Nexus Income Vault",
    description: "Stable fixed-income investment with consistent monthly returns.",
    roi: "3.5% monthly",
    roiLabel: "42-60% monthly",
    min: "₦10,000,000",
    duration: "12 months",
    tag: "Income Vault",
    tagClass: "bg-neon-tangerine/20 text-neon-tangerine",
    image: "/assets/products/vault.png",
  },
  {
    name: "Fractional Real Estate",
    description: "Own a fraction of prime real estate assets within our managed fund.",
    roi: "3.5% monthly",
    roiLabel: "42-60% monthly",
    min: "₦10,000,000",
    duration: "18 months",
    tag: "Real Estate",
    tagClass: "bg-blue-100 text-blue-700",
    image: "/assets/products/realestate.png",
  },
  {
    name: "Wealth Plans",
    description: "Structured long-term plans for diversified portfolio growth.",
    roi: "3.5% monthly",
    roiLabel: "42-60% monthly",
    min: "₦10,000,000",
    duration: "24 months",
    tag: "Structured",
    tagClass: "bg-purple-100 text-purple-700",
    image: "/assets/products/wealth.png",
  },
];

const stats = [
  { value: "100+", label: "Active Investors", icon: Users, color: "text-neon-tangerine" },
  { value: "₦2.4B+", label: "Assets Under Management", icon: BarChart3, color: "text-blue-500" },
  { value: "3.5%", label: "Monthly Returns", icon: TrendingUp, color: "text-green-500" },
  { value: "100%", label: "Asset-Backed", icon: Shield, color: "text-neon-tangerine" },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    location: "London, UK",
    tag: "Diaspora Investor",
    text: "I invested from the UK and received my first 3.5% return within a month, deposited straight into my wallet. The most transparent platform I have used.",
    initials: "AO",
    avatarBg: "bg-purple-500",
  },
  {
    name: "Babatunde Makinde",
    location: "Ibadan",
    tag: "Civil Servant",
    text: "I invest monthly through salary deductions. The dashboard helps me track every kobo. I have earned more in 2 years here than 6 years of bank savings.",
    initials: "BM",
    avatarBg: "bg-neon-tangerine",
  },
  {
    name: "Chidinma Eze",
    location: "Lagos",
    tag: "High-Net-Worth Investor",
    text: "Managing a portfolio across four properties through one dashboard is a game-changer. The reporting and document access is exactly what serious investors need.",
    initials: "CE",
    avatarBg: "bg-blue-500",
  },
];

const faqs = [
  {
    q: "What is 5PM NEXUS INVEST?",
    a: "5PM NEXUS INVEST is a real estate investment platform that allows investors to participate in carefully selected land acquisition and development projects. We acquire land below market value, secure all legal approvals, develop the infrastructure, sell the plots at a premium, and distribute returns to investors before taking our own profit."
  },
  {
    q: "How does the investment process work?",
    a: "Our process is simple: we acquire strategically located land below market value, perfect the title and approvals, develop the necessary infrastructure, sell the plots individually, pay investors from the sales proceeds, and retain the remaining profit as the company's earnings."
  },
  {
    q: "Is my investment secured?",
    a: "Yes. Every investment is backed by tangible real estate assets. Each project is supported by verified land documentation, legal approvals, and a structured development plan before it is offered to investors."
  },
  {
    q: "Who gets paid first?",
    a: "Investors are paid first from the proceeds generated through the sale of developed plots. The company's profit is realized only after investor obligations have been fulfilled."
  },
  {
    q: "Can I invest from outside Nigeria?",
    a: "Yes. Nigerians in the diaspora and international investors can participate in eligible projects, subject to the required KYC and onboarding process."
  },
  {
    q: "What is the minimum investment amount?",
    a: "The minimum investment amount depends on the specific project or investment package. Please contact our investment team for the current offering and entry requirements."
  },
  {
    q: "How do I track my investment?",
    a: "Investors receive regular updates on project progress, development milestones, and sales performance. Relevant documentation and investment reports are also made available throughout the investment cycle."
  },
];

function ScrollReveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function LandingPage() {
  return (
    <div className="bg-white text-gray-900">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-neon-tangerine/20 border border-neon-tangerine/30 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-neon-tangerine animate-pulse" />
                <span className="text-neon-tangerine text-xs font-semibold tracking-wide uppercase">ASSET-BACKED INVESTMENT PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] mb-6">
                Build Wealth.<br />
                <span className="text-neon-tangerine">Own Your</span><br />
                Future.
              </h1>

              <div className="w-20 h-1 bg-neon-tangerine rounded-full mb-6" />

              <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
                A professionally managed fund targeting up to 3.5% monthly returns, with strict risk controls on every move. Nothing wild, nothing rushed. Just steady, predictable growth backed by real estate assets.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to={ROUTES.REGISTER}>
                  <Button size="lg" className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-neon-tangerine/25">
                    Start Investing <ArrowRight size={18} />
                  </Button>
                </Link>
                <a href="#how" className="border-2 border-gray-300 hover:border-neon-tangerine text-gray-700 hover:text-neon-tangerine font-medium px-8 py-4 rounded-xl transition-all text-base">
                  See How It Works
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  Duly Registered
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-neon-tangerine" />
                  Asset-Backed
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-blue-500" />
                  Diaspora-Friendly
                </div>
              </div>
            </div>

            {/* Dashboard Preview Card */}
            <div className="relative hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-500">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-widest">Portfolio Value</p>
                    <p className="text-3xl font-black text-gray-900 mt-0.5">N4,820,500</p>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
                    +24.6% YTD
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-blue-500 text-lg font-black">N620K</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Returns Earned</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-neon-tangerine text-lg font-black">3</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Active Deals</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-green-500 text-lg font-black">18%</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">Annual ROI</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-neon-tangerine/20">
                        <Home size={16} className="text-neon-tangerine" />
                      </div>
                      <div>
                        <p className="text-gray-900 text-xs font-semibold">Lekki Phase 1 Residences</p>
                        <p className="text-gray-500 text-[10px]">Real Estate - 18 months</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 text-xs font-bold">+18% ROI</p>
                      <p className="text-gray-500 text-[10px]">N1.2M</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                        <Wallet size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-gray-900 text-xs font-semibold">Nexus Income Vault</p>
                        <p className="text-gray-500 text-[10px]">Structured - 12 months</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 text-xs font-bold">+15% ROI</p>
                      <p className="text-gray-500 text-[10px]">N500K</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-1 bg-gradient-to-r from-neon-tangerine to-neon-tangerine/40 rounded-full" />
              </div>

              <div className="absolute -top-4 -right-4 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900 text-xs font-semibold">Dividend Paid</p>
                  <p className="text-green-600 text-xs">N48,000 received</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Why Investors Choose Us</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-3 mb-4">The Smarter Way<br />to Invest in Nigeria</h2>
            <p className="text-gray-600 max-w-xl mx-auto">From diaspora investors to salary earners, 5PM NEXUS INVEST makes real wealth creation accessible, transparent, and profitable.</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield, title: "Asset-Backed Security",
                text: "Every investment is tied to real, tangible assets like real estate and structured products, so your capital is always backed by something real.",
                iconBg: "bg-neon-tangerine/20", iconColor: "text-neon-tangerine",
                borderHover: "hover:border-neon-tangerine/40",
              },
              {
                icon: TrendingUp, title: "Up to 3.5% Monthly Returns",
                text: "Our carefully selected real estate and income vault products target up to 3.5% monthly returns, well above conventional instruments. Returns are fixed, predictable, and paid monthly.",
                iconBg: "bg-dark-lavender/20", iconColor: "text-dark-lavender/80",
                borderHover: "hover:border-dark-lavender/40",
                tags: ["Real Estate: 3.5% p.m.", "Vault: 3-3.50% p.m."],
                featured: true,
              },
              {
                icon: Globe, title: "Invest from Anywhere",
                text: "Whether you are in Lagos, London, or Houston, you can open an account, complete KYC, and start investing in minutes. Full dashboard access on web and mobile.",
                iconBg: "bg-blue-100", iconColor: "text-blue-500",
                borderHover: "hover:border-blue-300",
              },
            ].map((card, i) => (
              <ScrollReveal key={i}>
                <div className={`bg-white border-2 rounded-2xl p-8 transition-all duration-300 h-full ${card.featured ? "border-neon-tangerine/40 shadow-lg shadow-neon-tangerine/20" : "border-gray-200 hover:shadow-lg"} ${card.borderHover}`}>
                  <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center mb-5`}>
                    <card.icon size={28} className={card.iconColor} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.text}</p>
                  {card.tags && (
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {card.tags.map((t) => (
                        <span key={t} className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${t.includes("Vault") ? "bg-neon-tangerine/10 text-neon-tangerine border-neon-tangerine/30" : "bg-dark-lavender/10 text-dark-lavender/80 border-dark-lavender/30"}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-24 bg-dark-lavender">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">About 5PM NEXUS INVEST</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 mb-6">Trusted Platform for<br />Wealth Creation</h2>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                5PM NEXUS INVEST channels investor capital into carefully selected real estate assets with verified revenue streams. Returns are fixed, predictable, and paid monthly, shielded from the volatility of equity markets and digital assets by the permanence of physical property.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                We run a professionally managed fund with strict risk controls on every capital deployment decision. Every position is secured by real estate assets: residential developments, commercial properties, and strategic land holdings.
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "N2.4B+", label: "Assets Under Management" },
                  { value: "100+", label: "Active Investors" },
                  { value: "3.5%", label: "Average Monthly ROI" },
                  { value: "100%", label: "Asset-Backed Security" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center">
                    <p className="text-2xl sm:text-3xl font-black text-neon-tangerine">{stat.value}</p>
                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Investment Products */}
      <section className="py-24 bg-gray-50" id="investments">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-14">
            <div>
              <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Investment Products</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Current Investment Deals</h2>
            </div>
            <Link to={ROUTES.INVESTMENT_OPPORTUNITIES} className="border-2 border-neon-tangerine hover:bg-neon-tangerine/10 text-neon-tangerine text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">
              View All Deals
            </Link>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ScrollReveal key={product.name}>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${product.tagClass}`}>
                      {product.tag}
                    </div>
                    <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      Open
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-gray-500 text-sm mb-5">{product.description}</p>
                    <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-gray-100">
                      <div>
                        <p className="text-neon-tangerine text-base font-black">{product.roi}</p>
                        <p className="text-gray-400 text-xs">Monthly</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-900 text-base font-black">{product.duration}</p>
                        <p className="text-gray-400 text-xs">Tenure</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 text-base font-black">{product.min}</p>
                        <p className="text-gray-400 text-xs">Min. Invest (NGN)</p>
                        <p className="text-gray-400 text-xs">$7,000 (USD)</p>
                      </div>
                    </div>
                    <Link to={ROUTES.REGISTER}>
                      <Button className="w-full bg-neon-tangerine hover:bg-neon-tangerine/80 text-white text-sm font-bold py-3 rounded-xl shadow-md shadow-neon-tangerine/20">
                        Invest Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white" id="how">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">The Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">From Sign-Up to Returns<br />in 4 Simple Steps</h2>
          </ScrollReveal>

          <div className="space-y-12">
            {[
              { step: "01", title: "Create Your Account", desc: "Sign up in minutes with your email, complete BVN and NIN verification, and upload your ID. Our KYC process is simple, secure, and fully digital.", checks: ["Email and Phone Verification", "BVN / NIN Check", "ID and Selfie Upload"], color: "bg-neon-tangerine" },
              { step: "02", title: "Fund Your Wallet", desc: "Deposit funds via bank transfer, card, or mobile money. Your wallet balance is displayed in real time. Diaspora investors can send in USD, GBP, or EUR.", checks: ["Bank Transfer and Card Payment", "USD, GBP, and EUR Accepted", "Instant Wallet Top-Up"], color: "bg-dark-lavender" },
              { step: "03", title: "Pick an Investment", desc: "Browse the marketplace, review project documents, and invest in real estate or structured products that match your goals.", checks: ["Fractional Real Estate", "Income Vault Products", "Full Document Access"], color: "bg-neon-tangerine" },
              { step: "04", title: "Earn and Withdraw", desc: "Track your returns live on your dashboard. When distributions are paid, they land in your wallet instantly for withdrawal or reinvestment.", checks: ["Live ROI Tracker", "Monthly Statements", "Instant Withdrawals"], color: "bg-dark-lavender" },
            ].map((item, i) => (
              <ScrollReveal key={i}>
                <div className="flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className={`w-14 h-14 rounded-full ${item.color} flex items-center justify-center font-black text-white text-xl shadow-lg relative z-10`}>
                      {i + 1}
                    </div>
                    {i < 3 && (
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <span className="text-neon-tangerine text-xs font-bold uppercase tracking-widest">Step {item.step}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 mb-3">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
                      {item.checks.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 text-xs">&#10003;</span>
                          </span>
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Investor Stories</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">Real People. Real Returns.</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i}>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                  <StarRating />
                  <p className="text-gray-600 text-sm leading-relaxed my-5">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm font-semibold">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.location} <span className="text-gray-300">-</span> {t.tag}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white" id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">Common Questions</h2>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <ScrollReveal key={faq.q}>
                <details className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden cursor-pointer">
                  <summary className="flex items-center justify-between p-5 text-sm font-semibold text-gray-900 list-none">
                    {faq.q}
                    <ChevronDown size={16} className="text-neon-tangerine group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neon-tangerine relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5">Your Wealth Journey<br />Starts Today</h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">Join over 100 investors already building wealth through transparent, asset-backed investments in Nigeria's fastest-growing markets.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" className="bg-white hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-base text-yellow-700 shadow-lg shadow-black/10 transition-all">
                  Create Free Account <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to={ROUTES.CONTACT}>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-medium px-10 py-4 rounded-xl text-base transition-all">
                  Contact Us
                </Button>
              </Link>
            </div>
            <p className="text-white/60 text-xs mt-6">No lock-in fees. Cancel anytime. Full transparency.</p>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}

export { ScrollReveal };
export default LandingPage;

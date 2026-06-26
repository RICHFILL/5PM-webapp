import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp, Building2, Shield, Star, ArrowRight, ChevronDown,
  Home, Wallet, CheckCircle, Globe, BarChart3, Users, MapPin, Mail, Phone, ChevronRight,
} from "lucide-react";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const products = [
  {
    name: "Nexus Income Vault",
    description: "Stable fixed-income investment with consistent returns.",
    roi: "3.5% – 5% monthly",
    roiLabel: "42–60% p.a.",
    min: "₦100,000",
    duration: "12 months",
    gradient: "from-brand-500 to-accent-coral",
    tag: "Income Vault",
    tagColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    iconColor: "text-cyan-400",
    bgIcon: "bg-cyan-500/20",
  },
  {
    name: "Fractional Real Estate",
    description: "Own a piece of prime real estate with fractional ownership.",
    roi: "3.5% – 5% monthly",
    roiLabel: "42–60% p.a.",
    min: "₦500,000",
    duration: "18 months",
    gradient: "from-navy-500 to-brand-500",
    tag: "Real Estate",
    tagColor: "bg-brand-500/20 text-brand-400 border-brand-500/30",
    iconColor: "text-brand-400",
    bgIcon: "bg-brand-500/20",
  },
  {
    name: "Wealth Plans",
    description: "Long-term wealth building with diversified portfolios.",
    roi: "3.5% – 5% monthly",
    roiLabel: "42–60% p.a.",
    min: "₦50,000",
    duration: "24 months",
    gradient: "from-accent-cyan to-navy-500",
    tag: "Structured",
    tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    iconColor: "text-purple-400",
    bgIcon: "bg-purple-500/20",
  },
];

const stats = [
  { value: "8,400+", label: "Active Investors", icon: Users, color: "text-brand-400" },
  { value: "₦2.4B+", label: "Assets Under Management", icon: BarChart3, color: "text-cyan-400" },
  { value: "3.5–5%", label: "Monthly Returns", icon: TrendingUp, color: "text-green-400" },
  { value: "100%", label: "Asset-Backed", icon: Shield, color: "text-brand-400" },
];

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    location: "London, UK · Diaspora Investor",
    text: "I invested ₦500,000 into the Lekki Estate fund from the UK. Within 14 months I received my 20% return — deposited straight into my wallet. This is the most transparent platform I've used.",
    rating: 5,
    initials: "AO",
    bg: "bg-purple-500",
  },
  {
    name: "Babatunde Makinde",
    location: "Ibadan · Civil Servant",
    text: "As a civil servant, I invest monthly through salary deductions. The dashboard helps me track every kobo. I've earned more in 2 years here than 6 years of bank savings.",
    rating: 5,
    initials: "BM",
    bg: "bg-brand-500",
  },
  {
    name: "Chidinma Eze",
    location: "Lagos · HNW Investor",
    text: "Managing a ₦20M portfolio across 4 properties through one dashboard is a game-changer. The reporting and document access is exactly what high-value investors need.",
    rating: 5,
    initials: "CE",
    bg: "bg-cyan-500",
  },
];

const faqs = [
  { q: "What is 5PM Nexus Invest?", a: "5PM Nexus Invest is a fintech-powered digital wealth and investment platform that connects investors to professionally managed, asset-backed real estate and structured financial products in Nigeria." },
  { q: "Is my investment safe?", a: "Every investment on our platform is tied to a real, tangible asset — real estate properties or structured financial instruments. We operate within regulatory guidelines and provide full document access to every investor." },
  { q: "Can I invest from outside Nigeria?", a: "Absolutely. 5PM Nexus Invest is built for the diaspora. You can fund your wallet in USD, GBP, or EUR, and your returns are denominated in Naira. Full KYC and account management is available remotely." },
  { q: "What is the minimum investment amount?", a: "Minimum investments vary by product. Wealth Plans start from ₦50,000, the Nexus Income Vault from ₦100,000, and Fractional Real Estate from ₦500,000. Each listing shows the minimum amount clearly." },
  { q: "How are returns paid out?", a: "Returns are paid directly into your wallet at maturity or on scheduled distribution dates, depending on the product. You'll receive a notification and can withdraw to your bank account or reinvest immediately." },
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
        <Star key={i} size={14} className="fill-brand-400 text-brand-400" />
      ))}
    </div>
  );
}

function LandingPage() {
  return (
    <div className="bg-navy-900 text-white">
      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: "radial-gradient(ellipse at 70% 40%, #352e6b 0%, #2a2551 55%, #1a1640 100%)" }}>
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #6255a4, transparent)" }} />
        <div className="absolute bottom-10 left-0 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle, #52c7e4, transparent)" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-5 blur-2xl" style={{ background: "radial-gradient(circle, #f68c23, transparent)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                <span className="text-brand-400 text-xs font-semibold tracking-wide uppercase">Nigeria's Premier Investment Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] mb-6">
                Build Wealth.<br />
                <span className="text-brand-400">Own Your</span><br />
                Future.
              </h1>

              <div className="w-20 h-1 rounded-full mb-6" style={{ background: "linear-gradient(90deg, #f68c23, #6255a4, #52c7e4)" }} />

              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
                Invest in professionally managed, asset-backed real estate and structured financial products — from anywhere in the world. Transparent returns. Zero guesswork.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link to={ROUTES.REGISTER}>
                  <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl text-base" style={{ boxShadow: "0 4px 32px rgba(246,140,35,0.35)" }}>
                    Start Investing <ArrowRight size={18} />
                  </Button>
                </Link>
                <a href="#how" className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-medium px-8 py-4 rounded-xl transition-all text-base">
                  See How It Works
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-400" />
                  SEC Registered
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-cyan-400" />
                  Asset-Backed
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-brand-400" />
                  Diaspora-Friendly
                </div>
              </div>
            </div>

            {/* Dashboard Preview Card */}
            <div className="relative hidden lg:block">
              <div className="bg-[#352e6b]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-2xl" style={{ animation: "float 4s ease-in-out infinite" }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest">Portfolio Value</p>
                    <p className="text-3xl font-black text-white mt-0.5">₦4,820,500</p>
                  </div>
                  <div className="bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/20">
                    +24.6% YTD
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-cyan-400 text-lg font-black" style={{ textShadow: "0 0 24px rgba(82,199,228,0.5)" }}>₦620K</p>
                    <p className="text-white/40 text-[10px] mt-0.5">Returns Earned</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-brand-400 text-lg font-black">3</p>
                    <p className="text-white/40 text-[10px] mt-0.5">Active Deals</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="text-green-400 text-lg font-black">18%</p>
                    <p className="text-white/40 text-[10px] mt-0.5">Annual ROI</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-500/20">
                        <Home size={16} className="text-brand-400" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">Lekki Phase 1 Residences</p>
                        <p className="text-white/40 text-[10px]">Real Estate · 18 months</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-xs font-bold">+18% ROI</p>
                      <p className="text-white/40 text-[10px]">₦1.2M</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-500/20">
                        <Wallet size={16} className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">Nexus Income Vault</p>
                        <p className="text-white/40 text-[10px]">Structured · 12 months</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-xs font-bold">+15% ROI</p>
                      <p className="text-white/40 text-[10px]">₦500K</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-1 rounded-full" style={{ background: "linear-gradient(90deg, #f68c23, #6255a4, #52c7e4)" }} />
              </div>

              <div className="absolute -top-4 -right-4 bg-navy-800 border border-white/10 rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle size={14} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">Dividend Paid</p>
                  <p className="text-green-400 text-xs">₦48,000 received</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-navy-800/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── WHY CHOOSE US ───── */}
      <section className="py-24" style={{ background: "#0f0d2a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Why Investors Choose Us</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mt-3 mb-4">The Smarter Way<br />to Invest in Nigeria</h2>
            <p className="text-white/50 max-w-xl mx-auto">From diaspora investors to salary earners, 5PM Nexus Invest makes real wealth creation accessible, transparent, and profitable.</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield, title: "Asset-Backed Security",
                text: "Every investment is tied to real, tangible assets — real estate, structured products — so your capital is always backed by something real.",
                iconBg: "bg-brand-500/15", iconColor: "text-brand-400",
              },
              {
                icon: TrendingUp, title: "3.5% – 5% Monthly Returns",
                text: "Our carefully selected real estate and income vault products consistently deliver monthly returns that outperform traditional savings by 3–5×.",
                iconBg: "bg-white/15", iconColor: "text-white",
                featured: true,
                tags: ["Real Estate: 18–22% p.a.", "Vault: 42–60% p.a."],
              },
              {
                icon: Globe, title: "Invest from Anywhere",
                text: "Whether you're in Lagos, London, or Houston — open an account, complete KYC, and start investing in minutes. Full dashboard access on web & mobile.",
                iconBg: "bg-cyan-500/15", iconColor: "text-cyan-400",
                linkText: "For the diaspora",
              },
            ].map((card, i) => (
              <ScrollReveal key={i}>
                <div
                  className={`rounded-2xl p-8 transition-all duration-300 h-full ${card.featured
                    ? "relative overflow-hidden"
                    : "border border-white/5 hover:shadow-[0_0_0_1px_#f68c23,0_20px_60px_rgba(246,140,35,0.15)] hover:-translate-y-1"
                    }`}
                  style={card.featured ? { background: "linear-gradient(145deg, #6255a4, #2a2551)" } : { background: "linear-gradient(145deg, #1e1b4b, #2a2551)" }}
                >
                  {card.featured && (
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20 blur-2xl -translate-y-1/3 translate-x-1/3" style={{ background: "#f68c23" }} />
                  )}
                  <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-5`}>
                    <card.icon size={24} className={card.iconColor} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{card.text}</p>
                  {card.tags && (
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {card.tags.map((t) => (
                        <span key={t} className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${t.includes("Vault") ? "bg-brand-500/20 text-brand-400" : "bg-white/10 text-white"}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {card.linkText && (
                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                      <span>{card.linkText}</span>
                      <ChevronRight size={14} />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── INVESTMENT PRODUCTS ───── */}
      <section className="py-24 bg-navy-900" id="investments">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-14">
            <div>
              <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Investment Products</span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2">Current Investment Deals</h2>
            </div>
            <Link to={ROUTES.INVESTMENT_OPPORTUNITIES} className="border border-brand-400/40 hover:border-brand-400 text-brand-400 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">
              View All Deals →
            </Link>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ScrollReveal key={product.name}>
                <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_0_1px_#f68c23,0_20px_60px_rgba(246,140,35,0.15)] hover:-translate-y-1" style={{ background: "linear-gradient(145deg, #1e1b4b, #2a2551)" }}>
                  <div className={`relative h-44 bg-gradient-to-br ${product.gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Building2 size={64} className="text-white" />
                    </div>
                    <div className={`absolute top-3 left-3 ${product.tagColor} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border`}>
                      {product.tag}
                    </div>
                    <div className="absolute top-3 right-3 bg-green-500/20 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-500/30">
                      Open
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-base mb-1">{product.name}</h4>
                    <p className="text-white/40 text-xs mb-4">{product.description}</p>
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <div>
                        <p className="text-brand-400 text-base font-black">{product.roi}</p>
                        <p className="text-white/40 text-[10px]">Monthly</p>
                      </div>
                      <div>
                        <p className="text-white text-base font-black">{product.duration}</p>
                        <p className="text-white/40 text-[10px]">Duration</p>
                      </div>
                      <div>
                        <p className="text-white text-base font-black">{product.min}</p>
                        <p className="text-white/40 text-[10px]">Min. Invest</p>
                      </div>
                    </div>
                    <Link to={ROUTES.REGISTER}>
                      <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold py-3 rounded-xl" style={{ boxShadow: "0 4px 32px rgba(246,140,35,0.35)" }}>
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

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-24" style={{ background: "#0f0d2a" }} id="how">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-16">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">The Process</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">From Sign-Up to Returns<br />in 4 Simple Steps</h2>
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5 hidden md:block" style={{ background: "linear-gradient(180deg, #f68c23, #6255a4)" }} />

            {[
              { step: "01", title: "Create Your Account", desc: "Sign up in minutes with your email, complete BVN/NIN verification, and upload your ID. Our KYC process is simple, secure, and fully digital.", checks: ["Email & Phone Verification", "BVN / NIN Check", "ID + Selfie Upload"], color: "bg-brand-500", shadow: "rgba(246,140,35,0.4)", align: "left" },
              { step: "02", title: "Fund Your Wallet", desc: "Deposit funds via bank transfer, card, or mobile money. Your wallet balance is displayed in real-time. Diaspora investors can send in USD, GBP, or EUR.", checks: ["Bank Transfer · Card Payment", "USD · GBP · EUR accepted", "Instant wallet top-up"], color: "bg-purple-500", shadow: "rgba(98,85,164,0.4)", align: "right" },
              { step: "03", title: "Pick an Investment", desc: "Browse the marketplace, review project documents, and invest in real estate or structured products that match your goals and risk appetite.", checks: ["Fractional Real Estate", "Income Vault Products", "Full document access"], color: "bg-brand-500", shadow: "rgba(246,140,35,0.4)", align: "left" },
              { step: "04", title: "Earn & Withdraw", desc: "Track your returns live on your dashboard. When distributions are paid, they land in your wallet instantly — withdraw anytime or reinvest to compound.", checks: ["Live ROI tracker", "Monthly statements", "Instant withdrawals"], color: "bg-purple-500", shadow: "rgba(98,85,164,0.4)", align: "right" },
            ].map((item, i) => (
              <ScrollReveal key={i}>
                <div className={`flex flex-col md:flex-row items-center gap-8 mb-12 ${item.align === "right" ? "md:flex-row-reverse" : ""}`}>
                  <div className={`md:w-1/2 ${item.align === "right" ? "md:pl-16" : "md:pr-16 md:text-right"}`}>
                    <div className={`inline-flex items-center gap-2 ${item.align === "right" ? "text-cyan-400" : "text-brand-400"} text-xs font-bold uppercase tracking-widest mb-3`}>
                      Step {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 font-black text-white text-lg z-10`} style={{ boxShadow: `0 4px 20px ${item.shadow}` }}>
                    {i + 1}
                  </div>
                  <div className={`md:w-1/2 ${item.align === "right" ? "md:text-right md:pr-16" : "md:pl-16"}`}>
                    <div className="bg-[#352e6b]/50 border border-white/5 rounded-xl p-4 text-sm text-white/50">
                      {item.checks.map((c) => (
                        <div key={c}>✅ {c}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">Investor Stories</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">Real People. Real Returns.</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i}>
                <div className="rounded-2xl p-7 border transition-all duration-300" style={{ background: "linear-gradient(145deg, rgba(98,85,164,0.15), rgba(42,37,81,0.6))", borderColor: i === 1 ? "rgba(246,140,35,0.3)" : "rgba(98,85,164,0.3)" }}>
                  <StarRating count={t.rating} />
                  <p className="text-white/70 text-sm leading-relaxed my-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-white font-bold text-sm`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{t.name}</p>
                      <p className="text-white/40 text-xs">{t.location}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="py-24" style={{ background: "#0f0d2a" }} id="faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <span className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em]">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">Common Questions</h2>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <ScrollReveal key={faq.q}>
                <details className="group bg-[#352e6b]/40 border border-white/5 rounded-xl overflow-hidden cursor-pointer">
                  <summary className="flex items-center justify-between p-5 text-sm font-semibold text-white list-none">
                    {faq.q}
                    <ChevronDown size={16} className="text-brand-400 group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="px-5 pb-5 text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #6255a4, #2a2551, #1a1640)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="w-16 h-1 mx-auto mb-8 rounded-full" style={{ background: "linear-gradient(90deg, #f68c23, #6255a4, #52c7e4)" }} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5">Your Wealth Journey<br />Starts Today</h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">Join over 8,400 investors already building wealth through transparent, asset-backed investments in Nigeria's fastest-growing markets.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-10 py-4 rounded-xl text-base" style={{ boxShadow: "0 4px 32px rgba(246,140,35,0.35)" }}>
                  Create Free Account <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to={ROUTES.CONTACT}>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-medium px-10 py-4 rounded-xl text-base">
                  Contact Us
                </Button>
              </Link>
            </div>
            <p className="text-white/30 text-xs mt-6">No lock-in fees · Cancel anytime · Full transparency</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-white/5 pt-16 pb-8" style={{ background: "#0a091e" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/assets/logo.png" alt="Logo" className="h-10 brightness-0 invert" />
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-5">Nigeria's premier asset-backed investment platform for investors at home and in the diaspora.</p>
              <div className="flex gap-3">
                {[
                  { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
                  { icon: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987S18.641.029 12.017.029z" },
                  { icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                ].map((social, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2.5 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Investment Marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nexus Income Vault</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fractional Real Estate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Wallet & Withdrawals</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2.5 text-white/40 text-sm">
                <li><Link to={ROUTES.ABOUT} className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to={ROUTES.HOW_IT_WORKS} className="hover:text-white transition-colors">How It Works</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to={ROUTES.CONTACT} className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2.5 text-white/40 text-sm">
                <li><Link to={ROUTES.TERMS} className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to={ROUTES.PRIVACY} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Investment Risk Notice</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© {new Date().getFullYear()} 5PM Nexus Invest Ltd. All rights reserved.</p>
            <div className="h-1 w-24 rounded-full" style={{ background: "linear-gradient(90deg, #f68c23, #6255a4, #52c7e4)" }} />
            <p className="text-white/30 text-xs">Built for Nigeria. Open to the World.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export { ScrollReveal };
export default LandingPage;

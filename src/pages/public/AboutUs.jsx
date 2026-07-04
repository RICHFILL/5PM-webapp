import { Link } from "react-router-dom";
import { Shield, TrendingUp, Users, Globe, Target, Eye, Building2, ArrowRight } from "lucide-react";
import { ROUTES } from "../../constants";
import { Button } from "../../components/common";

const values = [
  { icon: Shield, title: "Trust & Integrity", description: "We prioritize transparency and ethical practices in every investment opportunity we offer." },
  { icon: TrendingUp, title: "Financial Growth", description: "                We help our investors build sustainable wealth through a managed fund backed by real estate assets - residential, commercial, and land - with fixed, predictable returns paid monthly." },
  { icon: Users, title: "Community Focused", description: "We believe in democratizing access to premium investment opportunities for all Nigerians." },
  { icon: Globe, title: "Global Standards", description: "Our platform operates with world-class security standards and regulatory compliance." },
];

const team = [
  { name: "Management Team", role: "Decades of combined expertise in finance, technology, and real estate markets across Nigeria." },
  { name: "Advisory Board", role: "Industry leaders providing strategic guidance on regulatory compliance, risk management, and market expansion." },
  { name: "Technology Team", role: "Engineers and product specialists building a secure, scalable platform for the modern investor." },
];

function AboutUs() {
  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">About Us</span>
              <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">
                Building Nigeria's Most Trusted<br />Wealth Platform
              </h1>
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                5PM NEXUS INVEST is a professionally managed fund targeting up to 3.5% monthly returns, with strict risk controls on every move. We channel investor capital into carefully selected real estate assets with verified revenue streams - residential developments, commercial properties, and strategic land holdings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "₦2.4B+", label: "Assets Under Management" },
                { value: "100+", label: "Active Investors" },
                { value: "3.5%", label: "Avg. Monthly ROI" },
                { value: "100%", label: "Asset-Backed" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-xl p-5 border border-white/10 text-center">
                  <p className="text-xl sm:text-2xl font-black text-neon-tangerine">{s.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

   {/* ───── STORY ───── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 mb-6">From Vision to Reality</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              5PM NEXUS INVEST was built with a simple belief: if your money isn't growing every month, it's falling behind. Banks pay negligible returns. Inflation eats the rest.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              What started as a small team of passionate professionals has grown into a trusted investment platform serving investors across Nigeria and the diaspora. We run a fully managed fund - investors do not source deals, negotiate property transactions, or monitor markets. Our team handles every operational layer.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we continue to uphold the highest standards of transparency and risk management - because our investors' trust is our most valuable asset. Every investor position is secured by documented real estate assets, verified by independent professionals, with title documentation maintained and available for review.
            </p>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <p className="text-3xl font-black text-neon-tangerine">Founded</p>
              <p className="text-gray-900 font-semibold mt-2">2023</p>
              <p className="text-gray-500 text-sm mt-1">Year of establishment</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <p className="text-3xl font-black text-neon-tangerine">₦2.4B+</p>
              <p className="text-gray-900 font-semibold mt-2">Assets Managed</p>
              <p className="text-gray-500 text-sm mt-1">Across all products</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <p className="text-3xl font-black text-neon-tangerine">100+</p>
              <p className="text-gray-900 font-semibold mt-2">Active Investors</p>
              <p className="text-gray-500 text-sm mt-1">And growing daily</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* ───── MISSION & VISION ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-neon-tangerine/20 flex items-center justify-center mb-5">
                <Target className="text-neon-tangerine" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To provide a professionally managed fund that targets up to 3.5% monthly returns through carefully selected real estate assets, with strict risk controls on every capital deployment decision.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We bridge the gap between traditional investment vehicles and modern fintech, making asset-backed opportunities available to investors of all levels.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 md:p-10 border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-dark-lavender/20 flex items-center justify-center mb-5">
                <Eye className="text-dark-lavender" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To become the most trusted managed fund in Nigeria's real estate investment space - where every investor can build sustainable wealth through asset-backed positions, transparent reporting, and predictable monthly returns.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We envision a future where premium investment opportunities are no longer reserved for institutions but are accessible to every Nigerian with a smartphone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CORE VALUES ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-14 h-14 mx-auto mb-5 bg-neon-tangerine/10 rounded-2xl flex items-center justify-center">
                  <v.icon className="text-neon-tangerine" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── TEAM ───── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Our People</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">The Team Behind the Platform</h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">A diverse group of professionals committed to building the future of wealth management in Nigeria.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-dark-lavender/20 flex items-center justify-center mb-5">
                  <Building2 className="text-dark-lavender" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-dark-lavender">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Start Building Wealth?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">Join hundreds of investors already earning consistent returns through transparent, asset-backed investments.</p>
          <Link to={ROUTES.REGISTER}>
            <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base">
              Create Your Account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;

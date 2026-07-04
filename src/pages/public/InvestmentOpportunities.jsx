import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Building2, PiggyBank, Clock, Shield, CheckCircle } from "lucide-react";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const products = [
  {
    icon: PiggyBank,
    name: "Nexus Income Vault",
    description: "A professionally managed fixed-income product within our asset-backed fund, designed for investors seeking predictable monthly returns with capital preservation secured by real estate assets.",
    features: ["Monthly returns up to 3.5%", "Asset-backed capital preservation", "Position confirmed upon fund deployment"],
    roi: "Up to 3.5% monthly",
    min: "N10,000,000",
    minUSD: "$7,000",
    duration: "Flexible",
    tag: "Managed Fund",
    image: "/assets/products/vault.png",
  },
  {
    icon: Building2,
    name: "Fractional Real Estate",
    description: "Own a fractional share of premium real estate assets - residential developments, commercial properties, and strategic land holdings - professionally managed within our fund portfolio.",
    features: ["Physical asset-backed security", "Monthly return distributions", "Capital appreciation on exit"],
    roi: "Up to 3.5% monthly",
    min: "N10,000,000",
    minUSD: "$7,000",
    duration: "Flexible",
    tag: "Real Estate",
    image: "/assets/products/realestate.png",
  },
  {
    icon: PiggyBank,
    name: "Wealth Plans",
    description: "Diversified portfolio allocation within our managed fund, tailored to your financial goals - from steady monthly income to long-term capital appreciation through real estate assets.",
    features: ["Professionally managed portfolio", "Risk-adjusted monthly returns", "Flexible tenure on your terms"],
    roi: "Up to 3.5% monthly",
    min: "N10,000,000",
    minUSD: "$7,000",
    duration: "Flexible",
    tag: "Structured",
    image: "/assets/products/wealth.png",
  },
];

const benefits = [
  { icon: Shield, title: "Asset-Backed Security", description: "Every investment is secured by tangible assets, reducing counterparty risk." },
  { icon: TrendingUp, title: "Competitive Returns", description: "Access returns that outperform traditional savings and fixed deposit rates." },
  { icon: Clock, title: "Flexible Tenure", description: "Choose investment durations that match your financial planning needs." },
];

function InvestmentOpportunities() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Investment Opportunities</span>
              <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">
                Curated Investments<br />Built for Growth
              </h1>
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                Explore our carefully selected range of asset-backed investment products designed to deliver consistent returns while preserving your capital.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "Up to 3.5%", label: "Monthly ROI" },
                { value: "N10M / $7K", label: "Minimum Investment" },
                { value: "100%", label: "Asset-Backed" },
                { value: "Flexible", label: "Tenure" },
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

      {/* Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {products.map((product) => (
            <div key={product.name} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="grid md:grid-cols-4">
                {/* Image */}
                <div className="relative h-48 md:h-auto overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:bg-gradient-to-r md:from-black/30 md:to-transparent" />
                  <div className="absolute bottom-4 left-4 md:hidden">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full">{product.tag}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 md:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-neon-tangerine/10 rounded-xl flex items-center justify-center">
                      <product.icon className="text-neon-tangerine" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h2>
                      <span className="text-xs font-semibold text-neon-tangerine uppercase tracking-wider">{product.tag}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                  <ul className="space-y-3">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-neon-tangerine shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sidebar */}
                <div className="bg-gray-50 p-8 md:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Target ROI</p>
                      <p className="text-2xl font-black text-neon-tangerine mt-1">{product.roi}</p>
                    </div>
                    <div className="w-full h-px bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Minimum Investment</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{product.min}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{product.minUSD}</p>
                    </div>
                    <div className="w-full h-px bg-gray-200" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tenure</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{product.duration}</p>
                    </div>
                  </div>
                  <Link to={ROUTES.REGISTER} className="mt-8 block">
                    <Button className="w-full bg-neon-tangerine hover:bg-neon-tangerine/80 text-white">
                      Invest Now <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">Built for Serious Investors</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-8 border border-gray-200">
                <div className="w-12 h-12 bg-neon-tangerine/10 rounded-xl flex items-center justify-center mb-4">
                  <b.icon className="text-neon-tangerine" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-dark-lavender">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Start Your Investment Journey</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">Create your account in minutes and gain access to exclusive investment opportunities.</p>
          <Link to={ROUTES.REGISTER}>
            <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base">
              Create Free Account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default InvestmentOpportunities;

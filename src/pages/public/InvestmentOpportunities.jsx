import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Building2, PiggyBank, Clock, Shield } from "lucide-react";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const products = [
  {
    icon: PiggyBank,
    name: "Nexus Income Vault",
    description: "A stable fixed-income investment product designed for investors seeking predictable monthly returns with capital preservation.",
    features: ["Monthly interest payments", "Capital guaranteed at maturity", "Low minimum investment"],
    roi: "12–18% p.a.",
    min: "₦100,000",
    duration: "6–24 months",
  },
  {
    icon: Building2,
    name: "Fractional Real Estate",
    description: "Own a fractional share of premium residential and commercial real estate properties across Nigeria's fastest-growing cities.",
    features: ["Property-backed security", " quarterly rental distributions", "Capital appreciation potential"],
    roi: "15–25% p.a.",
    min: "₦500,000",
    duration: "12–36 months",
  },
  {
    icon: TrendingUp,
    name: "Wealth Plans",
    description: "Diversified portfolio investment plans tailored to your financial goals, from short-term gains to long-term wealth building.",
    features: ["Professionally managed portfolios", "Risk-adjusted returns", "Flexible tenure options"],
    roi: "10–20% p.a.",
    min: "₦50,000",
    duration: "3–60 months",
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
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-5xl font-bold mb-6">Investment Opportunities</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Explore our carefully curated range of asset-backed investment products designed to help you grow your wealth.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {products.map((product) => (
            <div key={product.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="grid md:grid-cols-3">
                <div className="p-8 md:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                      <product.icon className="text-brand-500" size={24} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h2>
                  </div>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-8 flex flex-col justify-between border-l border-gray-100">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Target ROI</p>
                      <p className="text-xl md:text-2xl font-bold text-brand-500">{product.roi}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Minimum Investment</p>
                      <p className="text-lg font-semibold text-gray-900">{product.min}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-lg font-semibold text-gray-900">{product.duration}</p>
                    </div>
                  </div>
                  <Link to={ROUTES.REGISTER} className="mt-6 block">
                    <Button className="w-full">Invest Now <ArrowRight size={16} /></Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Why Invest With Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                  <b.icon className="text-brand-500" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default InvestmentOpportunities;

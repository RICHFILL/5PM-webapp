import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, TrendingUp, TrendingDown, Building2, PiggyBank,
  Clock, Shield, CheckCircle, AlertCircle
} from "lucide-react";
import { Button, Skeleton } from "../../components/common";
import { ROUTES } from "../../constants";
import { investmentApi } from "../../services/api";

const benefits = [
  { icon: Shield, title: "Asset-Backed Security", description: "Every investment is secured by tangible assets, reducing counterparty risk." },
  { icon: TrendingUp, title: "Competitive Returns", description: "Access returns that outperform traditional savings and fixed deposit rates." },
  { icon: Clock, title: "Flexible Tenure", description: "Choose investment durations that match your financial planning needs." },
];

const tagIcons = {
  "Managed Fund": PiggyBank,
  "Real Estate": Building2,
  "Structured": TrendingUp,
  "Fixed Income": TrendingDown,
};

function InvestmentOpportunities() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await investmentApi.getOpportunities({ status: "active" });
        const items = Array.isArray(res) ? res : res?.data ?? [];
        setProducts(items);
      } catch {
        setError("Failed to load investment opportunities");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const formatNaira = (val) => {
    const num = Number(val);
    if (num >= 1_000_000) return `N${(num / 1_000_000).toFixed(0)}M`;
    if (num >= 1_000) return `N${(num / 1_000).toFixed(0)}K`;
    return `N${num.toLocaleString()}`;
  };

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
                { value: products.length > 0 ? `${products[0]?.expectedROI || 3.5}%` : "Up to 3.5%", label: "Monthly ROI" },
                { value: products.length > 0 ? formatNaira(products.reduce((min, p) => Math.min(min, Number(p.minimumInvestment)), Infinity)) : "N10M", label: "Minimum Investment" },
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
          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No investment opportunities available at this time.</p>
              <p className="text-gray-400 mt-2">Check back soon for new products.</p>
            </div>
          ) : (
            products.map((product) => {
              const Icon = tagIcons[product.tag] || PiggyBank;
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="grid md:grid-cols-4">
                    {/* Image */}
                    <div className="relative h-48 md:h-auto overflow-hidden bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="text-gray-300" size={64} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:bg-gradient-to-r md:from-black/30 md:to-transparent" />
                      <div className="absolute bottom-4 left-4 md:hidden">
                        <span className="text-xs font-bold text-white/80 uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full">{product.tag || "Investment"}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 md:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-neon-tangerine/10 rounded-xl flex items-center justify-center">
                          <Icon className="text-neon-tangerine" size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h2>
                          {product.tag && (
                            <span className="text-xs font-semibold text-neon-tangerine uppercase tracking-wider">{product.tag}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                      {product.features && product.features.length > 0 && (
                        <ul className="space-y-3">
                          {product.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                              <CheckCircle size={16} className="text-neon-tangerine shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="bg-gray-50 p-8 md:p-10 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
                      <div className="space-y-6">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Target ROI</p>
                          <p className="text-2xl font-black text-neon-tangerine mt-1">{product.roiDisplay || `${product.expectedROI}%`}</p>
                        </div>
                        <div className="w-full h-px bg-gray-200" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Minimum Investment</p>
                          <p className="text-lg font-bold text-gray-900 mt-1">{formatNaira(product.minimumInvestment)}</p>
                          {product.minUSD && <p className="text-sm text-gray-500 mt-0.5">{product.minUSD}</p>}
                        </div>
                        <div className="w-full h-px bg-gray-200" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tenure</p>
                          <p className="text-lg font-bold text-gray-900 mt-1">{product.duration} months</p>
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
              );
            })
          )}
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

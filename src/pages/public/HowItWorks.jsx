import { Link } from "react-router-dom";
import { UserPlus, Shield, Wallet, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const steps = [
  { icon: UserPlus, title: "Create Your Account", description: "Sign up with your email and basic information. It takes less than 2 minutes to get started on the platform." },
  { icon: Shield, title: "Complete KYC Verification", description: "Verify your identity by providing your personal information, BVN/NIN, and uploading required documents. This ensures platform security and regulatory compliance." },
  { icon: Wallet, title: "Fund Your Wallet", description: "Deposit funds into your investment wallet via bank transfer. Your wallet is your gateway to all investment opportunities on the platform." },
  { icon: TrendingUp, title: "Choose Your Investment", description: "Browse our curated investment products — from fixed-income vaults to fractional real estate. Compare ROI, duration, and minimum requirements." },
  { icon: BarChart3, title: "Track & Earn Returns", description: "Monitor your portfolio performance, receive distributions directly to your wallet, and reinvest or withdraw as you grow your wealth." },
];

function HowItWorks() {
  return (
    <div>
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-brand-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Getting started with 5PM Nexus Invest is simple. Follow these five steps to begin your investment journey.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {steps.map((step, i) => (
            <div key={step.title} className="relative flex gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-full bg-brand-200 mt-2" />}
              </div>
              <div className="flex-1 pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center md:hidden">
                    <step.icon className="text-brand-500" size={24} />
                  </div>
                  <step.icon className="hidden md:block text-brand-500" size={24} />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h2>
                </div>
                <p className="text-gray-600 ml-0 md:ml-16">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-brand-500 to-navy-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to Start?</h2>
          <p className="text-lg text-white/80 mb-8">Join thousands of smart investors building wealth with 5PM Nexus Invest.</p>
          <Link to={ROUTES.REGISTER}>
            <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100">
              Create Your Account <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;

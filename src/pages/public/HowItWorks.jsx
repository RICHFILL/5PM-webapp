import { Link } from "react-router-dom";
import { UserPlus, Shield, Wallet, TrendingUp, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const steps = [
  { icon: UserPlus, title: "Reach Out or Visit Our Website", description: "Contact us via phone or visit www.5pmnexus.com. Our team will walk you through the programme in plain language - no jargon, no pressure.", checks: ["Call or email us", "Browse investment opportunities", "Speak with our team"] },
  { icon: Shield, title: "Review and Documentation", description: "Receive the investment agreement, asset disclosure, and programme terms. Review at your own pace with full transparency on every detail.", checks: ["Investment agreement", "Asset disclosure documents", "Programme terms and conditions"] },
  { icon: Wallet, title: "Capital Deployment", description: "Transfer funds through designated channels. Your position is confirmed upon receipt of funds, and your capital stays in your name throughout the tenure.", checks: ["Bank transfer deposits", "USD, GBP, and EUR accepted", "Capital stays in your name"] },
  { icon: TrendingUp, title: "Returns Begin", description: "Monthly returns activate from the confirmed deployment date. Dashboard access is granted immediately so you can track your position in real time.", checks: ["3.5% monthly target returns", "Real-time dashboard access", "Monthly payment schedule"] },
  { icon: BarChart3, title: "Stay Informed", description: "Receive monthly updates in clear, plain language. Monitor your position, view accrued returns, and choose to reinvest or withdraw - your capital, your terms.", checks: ["Monthly performance updates", "Live ROI tracking", "Easy withdrawal process"] },
];

function StepCard({ step, index, total }) {
  return (
    <div className="relative">
      {index < total - 1 && (
        <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
      )}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10 relative">
        <div className="flex items-start gap-5 md:gap-8">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-neon-tangerine/20 flex items-center justify-center">
              <step.icon className="text-neon-tangerine" size={28} />
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-neon-tangerine flex items-center justify-center text-white text-xs font-bold shadow-md">
              {index + 1}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.15em]">Step {String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-5">{step.description}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {step.checks.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xs">&#10003;</span>
                  </span>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">How It Works</span>
            <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">
              Start Investing in<br />Five Simple Steps
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              5PM NEXUS INVEST operates as a fully managed fund. Investors do not source deals, negotiate property transactions, or monitor markets. Our team handles every operational layer.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} index={i} total={steps.length} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-dark-lavender">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">Join hundreds of investors already earning consistent returns through transparent, asset-backed investments.</p>
          <Link to={ROUTES.REGISTER}>
            <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-black/10 transition-all">
              Create Your Account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HowItWorks;

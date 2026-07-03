import { Link } from "react-router-dom";
import { UserPlus, Shield, Wallet, TrendingUp, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "../../components/common";
import { ROUTES } from "../../constants";

const steps = [
  { icon: UserPlus, title: "Reach Out or Visit Our Website", description: "Contact us via phone or visit www.5pmnexus.com. Our team will walk you through the programme in plain language — no jargon, no pressure.", checks: ["Call or email us", "Browse investment opportunities", "Speak with our team"] },
  { icon: Shield, title: "Review & Documentation", description: "Receive the investment agreement, asset disclosure, and programme terms. Review at your own pace with full transparency on every detail.", checks: ["Investment agreement", "Asset disclosure documents", "Programme terms & conditions"] },
  { icon: Wallet, title: "Capital Deployment", description: "Transfer funds through designated channels. Your position is confirmed upon receipt of funds, and your capital stays in your name throughout the tenure.", checks: ["Bank transfer deposits", "USD · GBP · EUR accepted", "Capital stays in your name"] },
  { icon: TrendingUp, title: "Returns Begin", description: "Monthly returns activate from the confirmed deployment date. Dashboard access is granted immediately so you can track your position in real time.", checks: ["3.5% monthly target returns", "Real-time dashboard access", "Monthly payment schedule"] },
  { icon: BarChart3, title: "Stay Informed", description: "Receive monthly updates in clear, plain language. Monitor your position, view accrued returns, and choose to reinvest or withdraw — your capital, your terms.", checks: ["Monthly performance updates", "Live ROI tracking", "Easy withdrawal process"] },
];

function HowItWorks() {
  return (
    <div>
      {/* ───── HERO ───── */}
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

      {/* ───── STEPS ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-6 mb-16">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-neon-tangerine flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  {i + 1}
                </div>
                <p className="text-xs font-semibold text-gray-900">{step.title}</p>
                {i < steps.length - 1 && <div className="hidden md:block h-0.5 bg-neon-tangerine/30 mt-6 -mr-6 relative z-0" />}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-tangerine/20 flex items-center justify-center shrink-0">
                    <step.icon className="text-neon-tangerine" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-neon-tangerine uppercase tracking-wider">Step {i + 1}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-5">{step.description}</p>
                    <div className="flex flex-wrap gap-4">
                      {step.checks.map((c) => (
                        <div key={c} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle size={14} className="text-green-500 shrink-0" />
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-dark-lavender">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
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

export default HowItWorks;

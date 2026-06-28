import { useState } from "react";
import useAuthStore from "../../store/authStore";
import { Card, Skeleton } from "../../components/common";

function Calculator() {
  const { user } = useAuthStore();
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(15);
  const [duration, setDuration] = useState(12);
  const [result, setResult] = useState(null);

  const calculateReturns = () => {
    const monthlyRate = rate / 100 / 12;
    const months = duration;
    const monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalReturn = totalPayment - principal;
    setResult({ totalInvestment: principal, monthlyReturn: monthlyPayment - principal / months, totalReturn, finalAmount: totalPayment, annualReturn: (totalReturn / duration) * 12 });
  };

  const formatCurrency = (amount) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount || 0);

  if (!user) {
    return <div className="p-4 md:p-8 max-w-4xl mx-auto"><Skeleton className="h-8 w-64" /></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Investment Calculator</h1>
        <p className="text-gray-600">Calculate your potential returns on investments</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">Input Parameters</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Principal Amount (NGN)</label>
              <input type="range" min="100000" max="50000000" step="100000" value={principal} onChange={(e) => setPrincipal(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500" />
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <input type="number" value={principal} onChange={(e) => setPrincipal(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-semibold text-lg text-gray-900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Expected Annual Return Rate (%)</label>
              <input type="range" min="5" max="50" step="0.5" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500" />
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <input type="number" value={rate} onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-semibold text-lg text-gray-900" step="0.5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Investment Duration (Months)</label>
              <input type="range" min="3" max="60" step="1" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500" />
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-semibold text-lg text-gray-900" />
              </div>
            </div>
            <button onClick={calculateReturns}
              className="w-full bg-brand-500 text-white font-semibold py-3 rounded-lg hover:bg-brand-600 transition-all duration-200">
              Calculate Returns
            </button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">Calculation Results</h3>
          {result ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6 border border-brand-500">
                <p className="text-gray-600 text-sm mb-2">Total Return</p>
                <p className="text-2xl md:text-4xl font-bold text-brand-500">{formatCurrency(result.totalReturn)}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-600 text-xs mb-1 uppercase tracking-wider">Investment</p><p className="font-bold text-lg text-gray-900">{formatCurrency(result.totalInvestment)}</p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-600 text-xs mb-1 uppercase tracking-wider">Final Amount</p><p className="font-bold text-lg text-gray-900">{formatCurrency(result.finalAmount)}</p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-600 text-xs mb-1 uppercase tracking-wider">Monthly Return</p><p className="font-bold text-lg text-gray-900">{formatCurrency(result.monthlyReturn)}</p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-600 text-xs mb-1 uppercase tracking-wider">Annual Return</p><p className="font-bold text-lg text-gray-900">{formatCurrency(result.annualReturn)}</p></div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Investing <strong>{formatCurrency(result.totalInvestment)}</strong> for <strong>{duration} months</strong> at <strong>{rate}%</strong> annual return will yield a total return of <strong>{formatCurrency(result.totalReturn)}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-center">
              <p className="text-gray-600">Adjust the parameters and click Calculate to see results</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Calculator;

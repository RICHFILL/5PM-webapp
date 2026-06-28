import { useState, useEffect } from "react";
import { Brain, TrendingUp, PieChart, Shield, AlertTriangle, Lightbulb, BarChart3 } from "lucide-react";
import { analyticsApi } from "../../services/api";
import { Card, Skeleton, Badge } from "../../components/common";

const formatNaira = (amount) => "₦" + (amount || 0).toLocaleString("en-NG");

export default function AIAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await analyticsApi.getInsights();
        setData(res?.data || res);
      } catch { setData(null); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) {
    return <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid md:grid-cols-3 gap-6"><Skeleton.Card /><Skeleton.Card /><Skeleton.Card /></div>
    </div>;
  }

  const insights = data?.insights || {};
  const trends = data?.monthlyTrends || [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-4 md:p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Brain size={32} />
          <h1 className="text-2xl md:text-3xl font-bold">AI Analytics Engine</h1>
        </div>
        <p className="text-indigo-200">Intelligent portfolio insights, risk analysis, and personalized recommendations</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900">Total Invested</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatNaira(insights.totalInvested)}</p>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <PieChart size={20} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Diversification</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{insights.diversificationScore?.toFixed(0) || 0}%</p>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-orange-600" />
            <h3 className="text-sm font-semibold text-gray-900">Risk Score</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{insights.riskScore?.toFixed(0) || 0}%</p>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={20} className="text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-900">Products</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{insights.productTypes || 0}</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" /> Recommendations
          </h3>
          {insights.recommendations?.length > 0 ? (
            <div className="space-y-3">
              {insights.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                  <Lightbulb size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{r}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Your portfolio is well diversified. No recommendations at this time.</p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" /> Market Trends (6mo ROI)
          </h3>
          {trends.length > 0 ? (
            <div className="space-y-2">
              {trends.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600">{t.month}</span>
                  <span className="text-sm font-semibold text-green-600">{t.roi}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Trend data loading...</p>
          )}
        </Card>
      </div>
    </div>
  );
}

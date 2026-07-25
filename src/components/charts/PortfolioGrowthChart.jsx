import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { currencySymbol } from '../../utils/currency';

function PortfolioGrowthChart({ data = [], currency = "NGN" }) {
  const sym = currencySymbol(currency);
  const formatVal = (v) => `${sym}${(v / 1000000).toFixed(1)}M`;

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">No portfolio data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatVal} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v) => [`${sym}${v.toLocaleString()}`, 'Portfolio Value']} />
        <Line type="monotone" dataKey="value" stroke="#00B8DB" strokeWidth={2} dot={{ fill: '#00B8DB', r: 3 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default PortfolioGrowthChart;
